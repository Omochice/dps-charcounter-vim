# dps-charcounter-vim

Vim plugin for counting the number of characters in a sentence.


## Install

dein.vim

```toml
[[plugins]]
repo = "vim-denops/denops.vim"

[[plugins]]
repo = "Omochice/dps-charcounter-vim"
depends = ["denops.vim"]
```

## Usage

call `:CountChars <delimiter>` then, displays the number of characters in the part enclosed by `<delimiter>`.


