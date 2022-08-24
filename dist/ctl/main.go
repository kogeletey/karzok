package main

import (
	"archive/tar"
	"compress/gzip"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func DownloadPackage(filename, url string) (*os.File, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	out, err := os.Create(filename)
	if err != nil {
		return nil, err
	}
	defer out.Close()

	return out, err
}

func Untar(src, out string) error {
	read, err := os.Open(src)
	if err != nil {
		log.Fatal("failed open file", err)
		return err
	}

	defer read.Close()

	gzipRead, err := gzip.NewReader(read)
	if err != nil {
		return fmt.Errorf("error creating gzip reader: %w", err)
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
	Untar("karzok-0.2.9.tgz", "themes/karzok")
	//	DownloadPackage("${pkg}-${VERSION}.tgz", "https://registry.npmjs.org/${pkg}/-/${pkg}-${VERSION}.tgz")
}
