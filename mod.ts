import { renderMarkdown } from 'jsr:@littletof/charmd@^0.1.2';

export interface Dictionary {
    word: string,
    phonetic: string,
    phonetics: Array<Phonetic>,
    meanings: Array<Meaning>,
    license: object,
    sourceUrls: string[]
}

export interface Phonetic {
    audio: string,
    sourceUrl: string,
    license: {
        name: string,
        url: string
    },
}

export interface Definition {
    definition: string,
    synonyms: string[],
    antonyms: string[],
    example: string
}

export interface Meaning {
    partOfSpeech: string,
    definitions: Array<Definition>
}

async function requestWord(word: string){
    const request = new Request(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    
    const result = await fetch(request);
    const jsonResult = await result.json()

    return jsonResult;
}

export function find(...words: string[]){
    
    words.forEach(async word => {
        const jsonResult = await requestWord(word)
        let marktext = "";
        const defin_text:any = {}
        
        marktext = `${marktext}# ${word.toUpperCase()}`

        jsonResult.forEach( (resultList: Dictionary) => {
            resultList.meanings.forEach( meaning => {
                meaning.definitions.forEach( defin => {

                    if(!(meaning.partOfSpeech in defin_text)){
                        defin_text[meaning.partOfSpeech] = []
                    }
                    defin_text[meaning.partOfSpeech].push(defin.definition)
                })
            })
        })
        
        for(const x in defin_text){
            marktext = `${marktext}\n\n## ${x}`
    
            defin_text[x].forEach( (el:string) => {
                marktext = `${marktext}\n\n- ${el}`
            });
        }
        console.info(`\n${renderMarkdown(marktext)}`)
    });
}


if (import.meta.main) {
    find(...Deno.args)
}