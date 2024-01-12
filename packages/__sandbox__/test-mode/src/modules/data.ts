export class User{
    name : string
    constructor(name: string) {
        this.name = name
    }
}

export default function call():void {
    console.log("caller is invoked")
}