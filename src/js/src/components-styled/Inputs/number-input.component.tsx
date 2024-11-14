import React, {useEffect} from 'react';
import './number-input.style.css';

interface NumberInputProps {
    value: string,
    min?: number;
    max?: number;
    errorMessage?: string;
    onValueChange: (value: number | undefined) => void;
    hasError: (error: string | undefined) => void;
}

const NumberInputForm: React.FC<NumberInputProps> = ({
                                                         value = '',
                                                         min = 1,
                                                         max = 10,
                                                         errorMessage = 'Number out of range',
                                                         onValueChange,
                                                         hasError,
                                                     }) => {
    const [inputValue, setInputValue] = React.useState<string>(value ? value.toString() : '');
    const [error, setError] = React.useState<string | undefined>();

    useEffect(() => {
        hasError(error);
    }, [error, hasError]);

    useEffect(() => {
        setInputValue(value ? value.toString() : '');
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const numberValue = Number(newValue);

        if (newValue === '' || isNaN(numberValue)) {
            setError(newValue === '' ? undefined : 'Please enter a valid number');
            onValueChange(numberValue);
        } else if (numberValue < min || numberValue > max) {
            setError(errorMessage);
            onValueChange(numberValue);
        } else {
            setError(undefined);
            onValueChange(numberValue);
        }
    };

    return (
        <form>
            <label>
                <input type="number" className="styledNumberInput" value={value} onChange={handleChange}/>
            </label>
        </form>
    );
};

export default NumberInputForm;