import { autocmd, Denops, ensureNumber, execute, popup } from "./deps.ts";

async function makeEmptyBuffer(denops: Denops): Promise<number> {
  if (denops.meta.host === "nvim") {
    const bufnr = await denops.call("nvim_create_buf", false, true);
    ensureNumber(bufnr);
    return bufnr;
  } else {
    const name = "dps-popup-test://popup";
    await execute(denops, `badd ${name}`);
    const bufnr = await denops.call("bufnr", `^${name}$`);
    ensureNumber(bufnr);
    await denops.call("setbufvar", bufnr, "&buftype", "nofile");
    return bufnr;
  }
}

function closeCmd(denops: Denops, winid: number): string {
  if (denops.meta.host === "nvim") {
    return `nvim_win_close(${winid}, v:false)`;
  } else {
    return `popup_close(${winid})`;
  }
}

export async function openPopup(
  denops: Denops,
  content: string | string[],
  autoclose = false,
  style?: popup.PopupWindowStyle,
): Promise<void> {
  const row = await denops.call("line", ".");
  const vcol = await denops.call("virtcol", ".");
  ensureNumber(row);
  ensureNumber(vcol);
  if (typeof (style) === "undefined") {
    style = {
      row: 1,
      col: vcol,
      width: typeof content === "string"
        ? content.length
        : Math.max(...content.map((x) => x.length)),
      height: typeof content === "string" ? 1 : content.length,
      border: true,
    };
  }
  const bufnr = await makeEmptyBuffer(denops);
  ensureNumber(bufnr);

  const popupWinId = await popup.open(denops, bufnr, style);
  ensureNumber(popupWinId);

  await denops.call("setbufline", bufnr, 1, content);

  if (autoclose) {
    const cmd = closeCmd(denops, popupWinId);
    await autocmd.group(denops, "dps_float_close", (helper) => {
      helper.remove(
        ["CursorMoved", "CursorMovedI", "VimResized"],
        "*",
      );
      helper.define(
        ["CursorMoved", "CursorMovedI", "VimResized"],
        "*",
        `if (line('.') != ${row} || virtcol('.') != ${vcol}) | call ${cmd} | augroup dps_float_close | autocmd! | augroup END | endif`,
      );
    });
  }
  return await Promise.resolve();
}
