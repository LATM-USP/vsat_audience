* [Instructions](https://pmndrs.github.io/uikit/docs/tutorials/custom-fonts)

Here's an example using [Roboto](https://fonts.google.com/specimen/Roboto).

```shell
msdf-bmfont -f json roboto-regular.ttf -i charset.txt -m 256,512 -s 48
msdf-bmfont -f json roboto-bold.ttf -i charset.txt -m 256,512 -s 48
```

> Here's the `charset.txt` contents:
>
> ```
> !\"#$%&'()*+,-./0123456789:;<=>?@ÄÖÜABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`äöüabcdefghijklmnopqrstuvwxyz{|}~ß§
> ```

1. Copy the files into the [public/fonts](/public/fonts/) folder.
1. Reference the custom fonts
  [in the source](src/components/story/published/PublishedStory.tsx) and
  [here](src/components/story/published/fiction/Fiction.tsx).
