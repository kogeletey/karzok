package main

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
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
		pkg     = "anymatch"
		version = "3.1.2"
	)
	file, err := DownloadPackage("https://registry.npmjs.org/" + pkg + "/-/" + pkg + "-" + version + ".tgz")
	if err != nil {
		log.Printf("failed get package", err)
	}
	Untar(file, "themes/karzok")

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
			Name:   "default_language",
			Prompt: &survey.Input{Message: "Enter a language of your site"},
		},
		{
			Name:   "compile_sass",
			Prompt: &survey.Confirm{Message: "Do you want to enable Sass compilation?"},
		},
	}

	type Answers struct {
		Title            string `toml:"title"`
		BaseUrl          string `toml:"base_url" survey:"base_url"`
		Description      string `toml:"description"`
		DefaultLanguage  string `toml:"default_language" survey:"default_language"`
		BuildSearchIndex bool   `toml:"build_search_index" survey:"build_search_index"`
		CompileSass      bool   `toml:"compile_sass" survey:"compile_sass"`
	}

	var answers Answers

	survey.Ask(qs, &answers)

	if answers.Title == "" {
		answers.Title = "Karzok"
	}
	if answers.BaseUrl == "" {
		answers.BaseUrl = "http://localhost:8080"
	}

	if answers.DefaultLanguage == "" {
		answers.DefaultLanguage = "en"
	}

	file, err := os.Create("config.toml")
	if err != nil {
		log.Fatal("failed create config.toml", err)
	}

	defer file.Close()

	err = toml.NewEncoder(file).Encode(&answers)
	if err != nil {
		log.Fatal("failed create config.toml", err)
	}
}
