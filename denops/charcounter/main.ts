import {
  Denops,
  ensureArray,
  ensureNumber,
  ensureString,
  isString,
} from "./deps.ts";
import { openPopup } from "./popup.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    async charCount(args: unknown): Promise<void> {
      ensureString(args);
      const lastLine = await denops.call("line", "$");
      ensureNumber(lastLine);
      const lines = await denops.call("getline", 1, lastLine);
      ensureArray(lines, isString);
      const text = lines.map((x) => x.trim()).join("");
      const escaped = args.replace(
        /[\\^$.*+?()[\]{}|]/g,
        "\\$&",
      );
      const regex = new RegExp(`${escaped}(.+)${escaped}`);

      const row = await denops.call("line", ".");
      ensureNumber(row);
      const vcol = await denops.call("virtcol", ".");
      ensureNumber(vcol);

      const matches = text.match(regex);
      if (matches == null) {
        console.error("any string is matched");
      } else {
        const currentBufnr = await denops.call("bufnr", "%");
        ensureNumber(currentBufnr);
        const content = `${matches[1].length} chars`;
        await openPopup(denops, content, true);
      }
      return await Promise.resolve();
    },
  };
}
