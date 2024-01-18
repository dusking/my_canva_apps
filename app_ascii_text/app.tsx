import {Button, FormField, Rows, Select, TextInput, Slider, HelpCircleIcon} from "@canva/app-ui-kit";
import {addNativeElement} from "@canva/design";
import * as React from "react";
import styles from "styles/components.css";
import {useEffect, useState} from "react";
import figlet from 'figlet';

import Standard from "figlet/importable-fonts/Standard.js";
import Fraktur from "figlet/importable-fonts/Fraktur.js";
import Fuzzy from "figlet/importable-fonts/Fuzzy.js";
import Georgi16 from "figlet/importable-fonts/Georgi16.js";
import Ghost from "figlet/importable-fonts/Ghost.js";
import Glenyn from "figlet/importable-fonts/Glenyn.js";
import Graceful from "figlet/importable-fonts/Graceful.js";
import Graffiti from "figlet/importable-fonts/Graffiti.js";
import Hex from "figlet/importable-fonts/Hex.js";
import Hollywood from "figlet/importable-fonts/Hollywood.js";
import Impossible from "figlet/importable-fonts/Impossible.js";
import Isometric1 from "figlet/importable-fonts/Isometric1.js";
import Isometric3 from "figlet/importable-fonts/Isometric3.js";
import JsBracketLetters from "figlet/importable-fonts/JS Bracket Letters.js";
import JsStickLetters from "figlet/importable-fonts/JS Stick Letters.js";
import Jacky from "figlet/importable-fonts/Jacky.js";
import Lean from "figlet/importable-fonts/Lean.js";
import Letters from "figlet/importable-fonts/Letters.js";
import Linux from "figlet/importable-fonts/Linux.js";
import Marquee from "figlet/importable-fonts/Marquee.js";
import Merlin1 from "figlet/importable-fonts/Merlin1.js";
import Modular from "figlet/importable-fonts/Modular.js";
import NScript from "figlet/importable-fonts/NScript.js";
import NancyjImproved from "figlet/importable-fonts/Nancyj-Improved.js";
import Nipples from "figlet/importable-fonts/Nipples.js";
import O8 from "figlet/importable-fonts/O8.js";
import OS2 from "figlet/importable-fonts/OS2.js";
import Ogre from "figlet/importable-fonts/Ogre.js";
import Pagga from "figlet/importable-fonts/Pagga.js";
import Pebbles from "figlet/importable-fonts/Pebbles.js";
import Puffy from "figlet/importable-fonts/Puffy.js";
import Rectangles from "figlet/importable-fonts/Rectangles.js";
import RedPhoenix from "figlet/importable-fonts/Red Phoenix.js";
import Roman from "figlet/importable-fonts/Roman.js";
import RowanCap from "figlet/importable-fonts/Rowan Cap.js";
import Serifcap from "figlet/importable-fonts/Serifcap.js";
import Shadow from "figlet/importable-fonts/Shadow.js";
import Shimrod from "figlet/importable-fonts/Shimrod.js";
import Short from "figlet/importable-fonts/Short.js";
import SlantRelief from "figlet/importable-fonts/Slant Relief.js";
import Slant from "figlet/importable-fonts/Slant.js";
import Small from "figlet/importable-fonts/Small.js";
import Soft from "figlet/importable-fonts/Soft.js";
import StarWars from "figlet/importable-fonts/Star Wars.js";
import Stforek from "figlet/importable-fonts/Stforek.js";
import Stop from "figlet/importable-fonts/Stop.js";
import Swan from "figlet/importable-fonts/Swan.js";
import Sweet from "figlet/importable-fonts/Sweet.js";
import Trek from "figlet/importable-fonts/Trek.js";
import Tubular from "figlet/importable-fonts/Tubular.js";
import Twisted from "figlet/importable-fonts/Twisted.js";
import Univers from "figlet/importable-fonts/Univers.js";
import Varsity from "figlet/importable-fonts/Varsity.js";

const fonts = {
    Standard,
    Fraktur,
    Fuzzy,
    Georgi16,
    Glenyn,
    Graceful,
    Graffiti,
    Hex,
    Hollywood,
    Impossible,
    Isometric1,
    Isometric3,
    'JS Bracket Letters': JsBracketLetters,
    "Js Stick Letters": JsStickLetters,
    Jacky,
    Lean,
    Letters,
    Ghost,
    Linux,
    Marquee,
    Merlin1,
    Modular,
    NScript,
    "Nancyj Improved": NancyjImproved,
    Nipples,
    O8,
    OS2,
    Ogre,
    Pagga,
    Pebbles,
    Puffy,
    Rectangles,
    "Red Phoenix": RedPhoenix,
    Roman,
    "Rowan Cap": RowanCap,
    Serifcap,
    Shadow,
    Shimrod,
    Short,
    "Slant Relief": SlantRelief,
    Slant,
    Small,
    Soft,
    "Star Wars": StarWars,
    Stforek,
    Stop,
    Swan,
    Sweet,
    Trek,
    Tubular,
    Twisted,
    Univers,
    Varsity,
}

const fontStyleList = Object.keys(fonts) as const;

type FontStyle = typeof fontStyleList[number];
const fontStyleOptions = fontStyleList.map(value => ({
    value: value,
    label: value.replace(/\+/g, ' '),
}));

const NeutralAlert = () => {

    return <div style={{
        marginTop: '8px',
        display: 'flex',
        gap: '8px',
        backgroundColor: "var(--ui-kit-color-secondary)",
        padding: '8px 12px',
        borderRadius: '4px'
    }}>

        <HelpCircleIcon/>
        <div style={{fontSize: '13px', flexGrow: 1}}>
            Once added to design, adjust settings to:
            <ul style={{paddingLeft: '20px', margin: '0'}}>
                <li>Font: Anonymous Pro</li>
                <li>
                    Letter spacing: 0
                </li>
                <li>
                    Line spacing: 1
                </li>
                <li>
                    Widen the text box as necessary
                </li>
            </ul>
        </div>
    </div>
}

export const App = () => {

    const [fontStyle, setFontStyle] =
        React.useState<FontStyle>(() => fontStyleList.includes(window.localStorage.getItem('fontStyle')) ? window.localStorage.getItem('fontStyle') : 'Standard');
    const [textToConvert, setTextToConvert] = React.useState(
        () => window.localStorage.getItem('textSample') || "Hello!"
    );
    const [preview, setPreview] = React.useState("");
    const previewRef = React.useRef()
    const [clipBoard, setClipBoard] = useState(null)
    const [fontSize, setFontSize] = useState(() => window.localStorage.getItem('fontSize') || 6);

    const addElement = () => {
        addNativeElement({
            type: "TEXT",
            fontSize: 16,
            children: [preview],
        });
        fetch('https://api.duskin.me/ascii-text')
    }

    function copyCB() {
        previewRef.current.select();
        document.execCommand('copy');
        previewRef.current.blur();
        setClipBoard('Copied')
    }


    useEffect(() => {
        if (clipBoard) {
            const timer = setTimeout(() => {
                setClipBoard(null);
            }, 2000)
            return () => {
                clearTimeout(timer)
            }
        }
    }, [clipBoard])

    useEffect(() => {

        figlet.parseFont(fontStyle, fonts[fontStyle] ?? fonts['Standard']);
        figlet.text(textToConvert, {font: fontStyle}, (err, data) => {
            if (data) setPreview(data)
        })
    }, [textToConvert, fontStyle])

    return (
        <div className={styles.scrollContainer}>
            <Rows spacing="3u">
                <FormField
                    label="Text"
                    value={textToConvert}
                    control={(props) => (
                        <TextInput
                            {...props}
                            onChange={(value) => {
                                setTextToConvert(value);
                                window.localStorage.setItem('textSample', value);

                            }}
                        />
                    )}
                />
                <FormField
                    label="Font style"
                    value={fontStyle}
                    control={(props) => (
                        <Select<FontStyle>
                            {...props}
                            options={fontStyleOptions}
                            onChange={(value) => {
                                setFontStyle(value);
                                window.localStorage.setItem('fontStyle', value);
                            }}
                            stretch
                        />
                    )}
                />

                <FormField
                    label="Preview font size"
                    value={fontSize}
                    control={(props) => (
                        <Slider min={3} max={12} {...props} onChange={value => {
                            setFontSize(value)
                            window.localStorage.setItem('fontSize', value);
                        }}/>
                    )}
                />
                <FormField
                    label="Preview"
                    value={preview}
                    control={(props) => (
                        <textarea ref={previewRef} style={{
                            resize: 'none',
                            fontSize: `${fontSize}px`,
                            whiteSpace: 'pre',
                            aspectRatio: '4/3',
                            outline: 'none !important',
                            border: 'none !important',
                            borderRadius: '4px',
                            backgroundColor: "var(--ui-kit-color-page)",
                            borderColor: "var(--ui-kit-border-color) !important",
                            overflowX: 'scroll',
                            overflowY: 'auto',
                            color: "var(--ui-kit-color-typography-primary)",
                        }} value={preview}/>
                    )}
                />
                <Rows spacing="1u">
                    <Button variant="primary" onClick={addElement} stretch>
                        Add to design
                    </Button>
                    <Button variant="secondary" onClick={copyCB} stretch>
                        {clipBoard || 'Copy to clipboard'}
                    </Button>
                    <NeutralAlert/>
                </Rows>
            </Rows>
        </div>
    );
};
