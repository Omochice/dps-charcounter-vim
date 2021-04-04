import { start } from "https://deno.land/x/denops_std@v0.4/mod.ts";

start(async (vim) => {
  vim.register({
    async wordcount(args: unknown): Promise<unknown> {
      console.log(args);
      let delimiter = `${args}`;
      let lastLineNumber = await vim.call("line", "$");
      let lines = await vim.call("getline", 1, lastLineNumber) as string[];
      let text = lines.join("");
      let escaped_delimiter = delimiter.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
      let regex = new RegExp(`${escaped_delimiter}(.+)${escaped_delimiter}`);

      let match_texts = text.match(regex);
      if (match_texts == null) {
        console.log("any string is matched");
      } else {
        console.log(match_texts[1].length);
      }

      // console.log(regex);
      return await Promise.resolve();
    },
  });

  await vim.execute(`
                    command! -nargs=1 CountChars call denops#request("${vim.name}", "wordcount", [<q-args>])
                    `);
});
