import { start } from "https://deno.land/x/denops_std@v0.4/mod.ts";

start(async (vim) => {
  vim.register({
    async countChars(args: unknown): Promise<void> {
      const delimiter = `${args}`;
      const lastLine = await vim.call("line", "$");
      const lines = await vim.call("getline", 1, lastLine) as string[];
      const text = lines.map((x) => x.trim()).join("");
      const escaped = delimiter.replace(
        /[\\^$.*+?()[\]{}|]/g,
        "\\$&",
      );
      const regex = new RegExp(`${escaped}(.+)${escaped}`);

      const matches = text.match(regex);
      if (matches == null) {
        console.log("any string is matched");
      } else {
        const content = `${matches[1].length} chars`;
        await vim.call("popup_atcursor", content, {
          "border": [1, 1, 1, 1],
          "borderchars": ["-", "|", "-", "|", "+", "+", "+", "+"],
        });
      }

      // console.log(regex);
      // console.log(matches);
      return await Promise.resolve();
    },
  });

  await vim.execute(`
                    command! -nargs=1 CountChars call denops#request("${vim.name}", "countChars", [<q-args>])
                    `);
});
