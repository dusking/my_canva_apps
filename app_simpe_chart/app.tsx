import {
    Button,
    Rows,
    Columns,
    Column,
    Select,
    Text,
    TextInput,
    ColorSelector,
    ClearIcon,
    PlusIcon,
    LoadingIndicator
} from "@canva/app-ui-kit";
import {upload} from "@canva/asset";
import {addNativeElement} from "@canva/design";
import * as React from "react";
import styles from "styles/components.css";
import {useState, useEffect} from "react";


type Chart = "pie" | "doughnut" | "bar_vertical" | "bar_horizontal" | "line" | "scatter";

const chartVariants: Chart[] = ["pie", "doughnut", "bar_vertical", "bar_horizontal", "line", "scatter"];

const chartOptions = chartVariants.map(value => ({
    value: value,
    label: value.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
}));

const COLOR_PALLETTE = ['#fff100', '#ff8c00', '#e81123', '#ec008c', '#68217a', '#00188f', '#00bcf2', '#00b294', '#009e49', '#bad80a']
const MAX_ROWS = 10;

const CONFIG: Record<Chart, Record<string, boolean>> = {
    'pie': {
        inlineColorPicker: true,
        globalColorPicker: false,
        axisLabels: false
    },
    'doughnut': {
        inlineColorPicker: true,
        globalColorPicker: false,
        axisLabels: false
    },
    'bar_vertical': {
        inlineColorPicker: true,
        globalColorPicker: false,
        axisLabels: true
    },
    'bar_horizontal': {
        inlineColorPicker: true,
        globalColorPicker: false,
        axisLabels: true
    },
    'line': {
        inlineColorPicker: false,
        globalColorPicker: true,
        axisLabels: true
    },
    'scatter': {
        inlineColorPicker: false,
        globalColorPicker: true,
        axisLabels: true
    },

}
export const App = () => {
    const [newChartData, setNewChartData] = useState([{label: '', value: '', color: COLOR_PALLETTE[0]}]);

    const [globalColor, setGlobalColor] = useState("#3038EF")
    const [xLabel, setXLabel] = useState('');
    const [yLabel, setYLabel] = useState('');

    const [isDrawing, setIsDrawing] = useState(false);
    const [chartStyle, setChartStyle] =
        useState<Chart>(() => window.localStorage.getItem('chartStyle') || 'pie');

    const [textTitle, setTextTitle] = useState(
        () => window.localStorage.getItem('textSample')
    );

    const generateRandomId = (prefix: string) =>
        `${prefix}${btoa(Date.now().toString())}${btoa(
            (Math.random() * 1_000_000_000_000).toString()
        )}`.replace(/=+/g, "");

    const importAndAddImage = async (image_url) => {
        const filename = image_url.substring(image_url.lastIndexOf("/") + 1).replace(/\./g, '');
        const randomId = generateRandomId(filename).replace(/_/g, '');
        console.log(`Uploading image ${randomId}`)

        // Start uploading the image
        const image = await upload({
            type: "IMAGE",
            mimeType: "image/png",
            url: image_url,
            thumbnailUrl: image_url,
            id: randomId
        });

        // Add the image to the design, using the thumbnail at first, and replacing
        // with the full image once the upload completes
        await addNativeElement({
            type: "IMAGE",
            ref: image.ref,
        });

        // Wait for the upload to finish so we can report errors if it fails to upload
        await image.whenUploaded();

        // upload is completed
        console.log("Upload complete!");
        setIsDrawing(false)
    };

    const onSubmit = () => {
        setIsDrawing(true);
        setNewChartData(p => p.filter(({
                                           label,
                                           value
                                       }) => label !== '' && value !== ''))

        const data = {
            'plot_type': chartStyle,
            'title': textTitle,
            'data': newChartData.filter(({label, value}) => label !== '' && value !== '').map(({label, value, color}) => ({label, color, value: Number(value)})),
            'x_label': xLabel,
            'y_label': yLabel,
            'global_color': globalColor
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        };
        const baseUri = 'https://api.duskin.me'
        fetch(`${baseUri}/not-public-yet`, options)
            .then(response => response.json())
            .then(data => importAndAddImage(data.url))
            .catch(error => {
                console.error(error);
                setIsDrawing(false);
            });
    }

    const onKeyChange = (newLabel: string, index: number) => {
        setNewChartData(prev => {
            const copy = [...prev];
            const currentItem = copy[index];
            copy[index] = {...currentItem, label: newLabel}
            return copy;
        })
    }

    const onValueChange = (newValue: string, index: number) => {
        function isValueValid(value: string): boolean {
            return /^[1-9]+\d*(\.\d*){0,1}$/.test(value) || value === '' || value === '0'
        }

        const isValid = isValueValid(newValue)
        if (isValid)
            setNewChartData(prev => {
                const copy = [...prev];
                const currentItem = copy[index];
                copy[index] = {...currentItem, value: newValue}
                return copy;
            })
    }

    const onColorChange = (newColor: string, index: number) => {
        setNewChartData(prev => {
            const copy = [...prev];
            const currentItem = copy[index];
            copy[index] = {...currentItem, color: newColor}
            return copy;
        })
    }

    const addTableData = () => setNewChartData(p => {
        const currentColors = p.map(({color}) => color)
        const unusedColors = COLOR_PALLETTE.filter(color => !currentColors.includes(color))
        return [...p, {label: '', value: '', color: unusedColors[0]}]
    });

    const removeTableDataRow = (index: number) => setNewChartData(p => {
        const currentColor = p[index].color;

        if (p.length === MAX_ROWS && p[p.length - 1].label !== '') {
            return [...p.toSpliced(index, 1), {label: '', value: 0, color: currentColor}]
        }
        if (p.length !== 1) return p.toSpliced(index, 1)
        return p
    });

    const hasValidValue = newChartData.some(({value, label}) => value && label)

    return (
        <div className={styles.scrollContainer}>
            <Rows spacing="2u">
                <Columns alignY="center" spacing="0.5u">
                    <Column>
                        <Text size="medium">Chart Style</Text>
                    </Column>
                    <Column width="2/3">
                        <Select<Chart>
                            value={chartStyle}
                            options={chartOptions}
                            onChange={(value) => {
                                setChartStyle(value);
                                window.localStorage.setItem('chartStyle', value);
                            }}
                            stretch
                        />
                    </Column>
                </Columns>

                <Columns alignY="center" spacing="0.5u">
                    <Column>
                        <Text size="medium">Chart Title</Text>
                    </Column>

                    <Column width="2/3">
                        <TextInput
                            placeholder="Enter title"
                            value={textTitle}
                            onChange={(value) => {
                                setTextTitle(value);
                                window.localStorage.setItem('textSample', value);
                            }}
                        />
                    </Column>
                </Columns>

                {CONFIG[chartStyle].axisLabels &&
                    <>
                        <Columns alignY="center" spacing="0.5u">
                            <Column>
                                <Text size="medium">X Axis Label</Text>
                            </Column>
                            <Column width="2/3">
                                <TextInput
                                    placeholder="Enter X label"
                                    value={xLabel}
                                    onChange={(label) => setXLabel(label)}
                                />
                            </Column>
                        </Columns>
                        <Columns alignY="center" spacing="0.5u">
                            <Column>
                                <Text size="medium">Y Axis Label</Text>
                            </Column>
                            <Column width="2/3">
                                <TextInput
                                    placeholder="Enter Y label"
                                    value={yLabel}
                                    onChange={(label) => setYLabel(label)}
                                />
                            </Column>
                        </Columns>
                    </>}
                {CONFIG[chartStyle].globalColorPicker &&
                    <Columns alignY="center" spacing="0.5u">
                        <Column>
                            <Text size="medium">Color</Text>
                        </Column>
                        <Column width="2/3">
                            <ColorSelector
                                color={globalColor}
                                onChange={(newColor) => setGlobalColor(newColor)}
                            />
                        </Column>
                    </Columns>}
                <table>
                    <thead>
                    <tr>
                        <td style={{textAlign: 'center'}}>
                            <Text size="medium" alignment="center">
                                Label
                            </Text>
                        </td>
                        <td style={{textAlign: 'center'}}>
                            <Text size="medium" alignment="center">
                                Value
                            </Text>
                        </td>
                        {CONFIG[chartStyle].inlineColorPicker && <td style={{textAlign: 'center'}}>
                            <Text size="medium">
                                Color
                            </Text>
                        </td>}
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        newChartData.map(({color, value, label}, index) => <tr key={index}>
                            <td>
                                <TextInput
                                    placeholder="Enter label"
                                    value={label}
                                    onChange={(newKey) => {
                                        if (newKey.length <= 15) onKeyChange(newKey, index)
                                    }}
                                />

                            </td>
                            <td>
                                <TextInput
                                    placeholder="Enter value"
                                    value={value}
                                    onChange={(newKey) => {
                                        if (newKey.length < 10) onValueChange(newKey, index)
                                    }}
                                />
                            </td>
                            {CONFIG[chartStyle].inlineColorPicker && <td>
                                <ColorSelector
                                    color={color}
                                    onChange={(newColor) => onColorChange(newColor, index)}
                                />
                            </td>}
                            <td onClick={() => removeTableDataRow(index)}>
                                <div style={{
                                    cursor: 'pointer',
                                    padding: 0,
                                    margin: 0,
                                    visibility: newChartData.length === 1 && 'hidden'
                                }}>
                                    <ClearIcon/>
                                </div>
                            </td>
                        </tr>)
                    }
                    <tr>
                        <td>
                            <Button variant="secondary" onClick={addTableData} stretch
                                    disabled={newChartData.length === MAX_ROWS}>
                                <PlusIcon/>
                            </Button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <Button variant="primary" onClick={onSubmit} stretch disabled={isDrawing || !hasValidValue}>
                    {isDrawing ? <LoadingIndicator/> : "Add It!"}
                </Button>
            </Rows>
        </div>
    );
};
