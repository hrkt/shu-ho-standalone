# ToDo

## App

- [x] enable save buffer function
- [ ] a rich template

## DevEnv

- [x] WebPack "dev" to be work

  ->workaround: webpack -w & electron .



## External

- [ ] write electron-packager patch

```
   // I'm writing patch for electron-packager now, so this line does not work in other environments.
    // "package": "./node_modules/.bin/electron-packager . --overwrite  --prune=true --electron-version=1.6.1 --out=release --package-manager=yarn",
```