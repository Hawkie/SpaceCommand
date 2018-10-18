export class MarkovChains {
    words : string[];
    table : any;
    END_OF_WORD = "\n";
    constructor(words : string[]) {
        this.words = words;
        this.table = [];
        this.generateTable();
    }

    generateTable(): void {
        this.table = [];
        this.words.forEach(word => {
            this.addWordToTable(word + this.END_OF_WORD);
        });
    }

    addWordToTable(word : string): void {
        let previousLetter:string = word.charAt(0);
        word.substr(1).split("").forEach(letter => {
            console.log(previousLetter + " : " + letter);

            if(!this.table[previousLetter]) {
                this.table[previousLetter] = [];
            }

            if(this.table[previousLetter][letter]) {
                this.table[previousLetter][letter]++;
            } else {
                this.table[previousLetter][letter] = 1;
            }
            previousLetter = letter;
        });
    }

    generateNewWord(): void {
        //
    }
}