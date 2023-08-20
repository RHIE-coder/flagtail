export function eraseNodeModulesLetters(filepath:string):string {
    return filepath.replace(/^(.+)[\\/]node_modules$/, '$1');
}

