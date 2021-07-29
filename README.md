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

Call `:CharCount <delimiter>` then, displays the number of characters in the part enclosed by `<delimiter>`.
If `<delimiter>` is not set, count all characters in the window.

![usage image](https://i.gyazo.com/549ea12b7ab748cb01cd77ac33fb79cd.gif)
