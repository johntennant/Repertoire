

function convertPGN(pgnText) {
    // 1. Remove the PGN headers.
    const gameBody = pgnText.split(/\n\n/)[1];
    
    // 2. Convert ? and ! annotations to standard NAGs.
    const conversionMapping = {
        '?!': '$5',
        '!': '$1',
        '!!': '$3',
        '?': '$2',
        '??': '$4',
        '!?': '$6'
    };
    
    let converted = gameBody;
    for (const key in conversionMapping) {
        const regex = new RegExp(`\\s${key}(?!\\w)`, 'g');
        converted = converted.replace(regex, ` ${conversionMapping[key]}`);
    }
    
    // 3. Split main line and sub-variations.
    let mainLine = "";
    const subVariations = [];
    let depth = 0;
    let currentVariation = "";

    for (let i = 0; i < converted.length; i++) {
        if (converted[i] === '(') {
            if (depth === 0) {
                mainLine += converted.substring(0, i);
                converted = converted.substring(i);
                i = 0;
            }
            depth++;
        }
        if (converted[i] === ')') {
            depth--;
            if (depth === 0) {
                subVariations.push(converted.substring(0, i + 1));
                converted = converted.substring(i + 1);
                i = 0;
            }
        }
    }

    // Concatenate the main line and sub-variations.
    let result = mainLine.trim() + "\n\n";
    for (const variation of subVariations) {
        result += variation.replace(/^\(|\)$/g, "").trim() + "\n\n";
    }
    return result.trim();
}

const pgnText = `[Event "CRUSH with the Vienna!: Vienna Gambit: 4...Qe7? Oh no my queen!"]
[Site "https://lichess.org/study/nq1GGbNO/JReD1gn1"]
[Result "*"]
[UTCDate "2023.09.25"]
[UTCTime "06:44:29"]
[Variant "Standard"]
[ECO "C29"]
[Opening "Vienna Game: Vienna Gambit"]
[Annotator "https://lichess.org/@/Bosburp"]

1. e4 e5 2. Nc3 Nf6 3. f4 exf4? { a mistake! this move is seen almost all the time at -1800 level. white can now get a huge initiative with e5! } 4. e5! { the only move that keeps the advantage! } 4... Qe7? { a very common try by black, but after Qe2 white still has no difficulties :) } 5. Qe2! { and now black's knight still has to go! } 5... Ng8 { for those who care: we are still on move 5 and white already has a whopping 72% winrate! } 6. Nf3 { d4 here is also a perfectly fine move, but Nf3 just avoids any annoying checks. } { [%csl Gh4][%cal Gf3h4] } 6... d6?? { a game losing blunder being played surprisingly in 61,000 games! Now white has to know how to punish black. } 7. Nd5! { the absolute game-ending move! the black queen is under attack and the e file is getting opened up } { [%csl Ge7][%cal Gd5e7] } 7... Qd8 (7... Qd7 8. exd6+ Kd8 (8... Qe6 9. Nxc7+ Kd8 10. Nxe6+) 9. dxc7+ Qxc7 10. Nxc7 Kxc7 $18) 8. exd6+! { I just want to point out that Nxc7! also works here. 8. Nxc7 Qxc7 9. exd6 and white also wins the queen } { [%csl Ge8][%cal Ge2e8] } 8... Be6 9. Nxc7+ { [%csl Ga8,Ge8][%cal Gc7a8,Gc7e8] } 9... Kd7 10. Ne5+ { just keep attacking! } 10... Kc8 (10... Kxd6 11. Nxe6 fxe6 12. Nf7+ Kc7 13. Nxd8) 11. Nxe6! { opening up the c file for the white queen! } 11... fxe6 12. Qc4+! { [%csl Gc8][%cal Gc4c8] } 12... Nc6 (12... Qc7 13. Qxc7#) 13. Qxc6+!! { beautiful! } 13... bxc6 (13... Kb8 14. Nd7+ Qxd7 15. Qxd7 $18) 14. Ba6+ Kb8 15. Nxc6# { a magnificent 15 move miniature!
sample game: https://lichess.org/b665jfjN } { [%csl Gb8,Yc8,Yb7,Bc7,Ra8,Ra7][%cal Gc6b8,Ya6c8,Bd6c7] } *


`;  // Your PGN text here
console.log(convertPGN(pgnText));
