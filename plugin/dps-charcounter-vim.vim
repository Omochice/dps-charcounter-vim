if exists('g:loaded_dps_charcounter') && g:loaded_charcounter
  finish
endif

let g:loaded_charcounter = v:true

" `command! -nargs=? CharCount call denops#request("${denops.name}", "charCount", [<q-args>])`,
command! CharCount call dps_charcounter#call([<q-args>])
