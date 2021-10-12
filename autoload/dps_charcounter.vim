function! chdps_charcounter#call(delimiter) abort
  call denops#plugin#wait('charcounter')
  call denops#notify('charcounter', 'charCount', delimiter)
endfunction
