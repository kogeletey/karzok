package main

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/AlecAivazis/survey/v2"
	"github.com/BurntSushi/toml"
)

func DownloadPackage(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	out, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return out, err
}

func Untar(src []byte, out string) error {
	gzipRead, err := gzip.NewReader(bytes.NewReader(src))
	if err != nil {
		log.Printf("error creating gzip reader: %w", err)
		return err
	}
	defer gzipRead.Close()

	tarRead := tar.NewReader(gzipRead)

	for {
		header, err := tarRead.Next()

		switch {

		case err == io.EOF:
			return nil

		// Return any other error
		case err != nil:
			log.Fatal(err)
			return err

		// If the header is nil, skip it
		case header == nil:
			continue

		// Skip the any duplicated hidden files
		case strings.HasPrefix(header.Name, "._"):
			continue
		}

		// The target location where the directory should be created
		segs := strings.Split(header.Name, string(filepath.Separator))
		segs = segs[1:]
		target := filepath.Join(out, filepath.Join(segs...))

		hInfo := header.FileInfo()

		if hInfo.IsDir() {
			os.MkdirAll(target, os.ModePerm)
			continue
		}

		if err = os.MkdirAll(filepath.Dir(target), os.ModePerm); err != nil {
			return err
		}

		file, err := os.OpenFile(target, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, hInfo.Mode())
		if err != nil {
			return err
		}

		for {
			_, err := io.CopyN(file, tarRead, 1024)
			if err != nil {
				if err == io.EOF {
					break
				}
				return err
			}
		}

		file.Close()
	}
}

func main() {
	var (
		pkg     = "is-binary-path"
		version = "2.1.0"
	)
	archive, err := DownloadPackage("https://registry.npmjs.org/" + pkg + "/-/" + pkg + "-" + version + ".tgz")
	if err != nil {
		log.Printf("failed get package", err)
	}
	folderExport := "themes"
	_, err = os.Stat(folderExport)
	if err == nil {
		os.RemoveAll(folderExport)
	}
	Untar(archive, folderExport+"/karzok")

	configFileString := "config.toml"
	_, err = os.Stat(configFileString)
	if err == nil {
		os.Rename(configFileString, "old."+configFileString)
	}

	var qs = []*survey.Question{
		{
			Name:   "title",
			Prompt: &survey.Input{Message: "Enter a title of your site (Default: Karzok)"},
		},
		{
			Name:   "base_url",
			Prompt: &survey.Input{Message: "Enter a url of your site (Default: http://localhost:8080)"},
		},
		{
			Name:   "description",
			Prompt: &survey.Input{Message: "Enter a description of your site"},
		},
		{
			Name:   "build_search_index",
			Prompt: &survey.Confirm{Message: "Do you want to build a search index of the content?"},
		},
		{
			Name:     "default_language",
			Prompt:   &survey.Input{Message: "Enter a language of your site"},
			Validate: survey.Required,
		},
		{
			Name:   "compile_sass",
			Prompt: &survey.Confirm{Message: "Do you want to enable Sass compilation?"},
		},
	}

	type Config struct {
		Title            string `toml:"title"`
		BaseUrl          string `toml:"base_url" survey:"base_url"`
		Description      string `toml:"description"`
		DefaultLanguage  string `toml:"default_language" survey:"default_language"`
		BuildSearchIndex bool   `toml:"build_search_index" survey:"build_search_index"`
		CompileSass      bool   `toml:"compile_sass" survey:"compile_sass"`
		MinifyHTML       bool   `toml:"minify_html"`
		Theme            string `toml:"theme"`
	}

	var config Config

	survey.Ask(qs, &config)

	if config.Title == "" {
		config.Title = "Karzok"
	}
	if config.BaseUrl == "" {
		config.BaseUrl = "http://localhost:8080"
	}

	if config.DefaultLanguage == "" {
		config.DefaultLanguage = "en"
	}

	config.MinifyHTML = true
	config.Theme = "karzok"

	configFile, err := os.Create(configFileString)
	if err != nil {
		log.Fatal("failed create"+configFileString, err)
	}

	defer configFile.Close()

	err = toml.NewEncoder(configFile).Encode(&config)
	if err != nil {
		log.Fatal("failed create"+configFileString, err)
	}

	type PackageJson map[string]interface{}

	var packagejson PackageJson
	packageFile, err := os.Open("package.json")
	if err != nil {
		log.Fatal("failed open default: %s", err)
	}

	defer packageFile.Close()

	err = json.NewDecoder(packageFile).Decode(&packagejson)
	if err != nil {
		log.Fatalf("failed decoding: %s", err)
	}
	packagejson["name"] = strings.ToLower(config.Title)
	packagejson["private"] = true

	for i := range packagejson {
		if i == "author" || i == "version" || i == "repository" {
			delete(packagejson, i)
		}
	}

	packageFile, err = os.Create("package.json")

	if err != nil {
		log.Printf("failed create modify: %s", err)
	}

	defer packageFile.Close()
	enc := json.NewEncoder(packageFile)
	enc.SetIndent("", "  ")
	enc.SetEscapeHTML(false)
	err = enc.Encode(&packagejson)

	if err != nil {
		log.Printf("failed encoding: %s", err)
	}
	//	os.Remove("kzkctl")
}
