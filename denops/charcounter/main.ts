// import { start } from "https://deno.land/x/denops_std@v0.4/mod.ts";
import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";
import {
  ensureArray,
  ensureNumber,
  ensureString,
  isString,
} from "https://deno.land/x/unknownutil@v0.1.1/mod.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async countChars(args: unknown): Promise<void> {
      ensureString(args);
      const lastLine = await denops.call("line", "$");
      ensureNumber(lastLine);
      const lines = await denops.call("getline", 1, lastLine) as string[];
      ensureArray(lines, isString);
      const text = lines.map((x) => x.trim()).join("");
      const escaped = args.replace(
        /[\\^$.*+?()[\]{}|]/g,
        "\\$&",
      );
      const regex = new RegExp(`${escaped}(.+)${escaped}`);

      const matches = text.match(regex);
      if (matches == null) {
        console.log("any string is matched");
      } else {
        const content = `${matches[1].length} chars`;
        await denops.call("popup_atcursor", content, {
          "border": [1, 1, 1, 1],
          "borderchars": ["-", "|", "-", "|", "+", "+", "+", "+"],
        });
      }

      // console.log(regex);
      // console.log(matches);
      return await Promise.resolve();
    },
  };

  await denops.cmd(
    `command! -nargs=1 CountChars call denops#request("${denops.name}", "countChars", [<q-args>])`,
  );
}
