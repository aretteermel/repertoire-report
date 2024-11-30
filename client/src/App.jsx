import {useState} from 'react';
import './App.css';
import axios from 'axios';
import {Button, Grid, TextField} from '@mui/material';
import {format} from 'date-fns';

function App() {
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        submitterName: '',
        submitterEmail: '',
        submitterPhone: '',
        performer: '',
        title: '',
        authors: '',
        frequency: '',
        duration: '',
        iswc: ''
    });
    const [repertoryRows, setRepertoryRows] = useState([
        {performer: '', title: '', authors: '', frequency: '', duration: '', iswc: ''},
    ]);
    const [repertoryId, setRepertoryId] = useState(null); // Store the ID from POST response
    const [repertoryJson, setRepertoryJson] = useState(null);

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDateChange = (field) => (date) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: date,
        }));
    };

    const handleRepertoryRowChange = (event, index) => {
        const {name, value} = event.target;
        const updatedRows = [...repertoryRows];
        updatedRows[index] = {...updatedRows[index], [name]: value};
        setRepertoryRows(updatedRows);
    };

    const addRepertoryRow = () => {
        setRepertoryRows([
            ...repertoryRows,
            {title: '', performer: '', frequency: '', duration: '', authors: '', iswc: ''}
        ]);
    };

    const addRepertory = async (event) => {
        event.preventDefault();

        const formattedData = {
            ...formData,
            startDate: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd HH:mm:ss') : '',
            endDate: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd HH:mm:ss') : '',
            repertoryRows
        };

        if (!formData.name || !formData.startDate || !formData.endDate || repertoryRows.length === 0) {
            alert("Required fields are missing!");
            console.error("Validation failed: One or more required fields are empty.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/api/repertory', formattedData);
            setRepertoryId(response.data.repertoryId);
            setRepertoryJson(null);
            alert("Yayyy!");
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleShowJson = async () => {
        if (!repertoryId) return;

        try {
            const response = await fetch(`http://localhost:8081/api/repertory/${repertoryId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch repertory data');
            }

            const data = await response.json();
            setRepertoryJson(data); // Update JSON display with fetched data
        } catch (error) {
            console.error('Error fetching JSON:', error);
        }
    };

    return (
        <form onSubmit={addRepertory}>
            <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                    <h1>Esita repertuaariaruanne</h1>
                </Grid>
                <Grid item xs={12}>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between" columnSpacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        type="text"
                                        name="name"
                                        label="Ürituse nimi"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <label>Algus * </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.startDate ? format(formData.startDate, 'yyyy-MM-dd\'T\'HH:mm') : ''}
                                        onChange={(e) => handleDateChange('startDate')(new Date(e.target.value))}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <label>Lõpp * </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.endDate ? format(formData.endDate, 'yyyy-MM-dd\'T\'HH:mm') : ''}
                                        onChange={(e) => handleDateChange('endDate')(new Date(e.target.value))}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between" columnSpacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        type="text"
                                        name="submitterName"
                                        label="Andmete esitaja nimi"
                                        value={formData.submitterName}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        type="email"
                                        name="submitterEmail"
                                        label="Andmete esitaja e-mail"
                                        value={formData.submitterEmail}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        type="text"
                                        name="submitterPhone"
                                        label="Andmete esitaja telefon"
                                        value={formData.submitterPhone}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        {repertoryRows.map((row, index) => (
                            <Grid item xs={12} key={index}>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="text"
                                            name="performer"
                                            label="Esitaja"
                                            value={row.performer}
                                            onChange={(e) => handleRepertoryRowChange(e, index)}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="text"
                                            name="title"
                                            label="Teos"
                                            value={row.title}
                                            onChange={(e) => handleRepertoryRowChange(e, index)}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="text"
                                            name="authors"
                                            label="Autor(id)"
                                            value={row.authors}
                                            onChange={(e) => handleRepertoryRowChange(e, index)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} marginTop={2}>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="number"
                                            name="frequency"
                                            label="Esitusi"
                                            value={row.frequency}
                                            onChange={(e) => handleRepertoryRowChange(e, index)}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="number"
                                            name="duration"
                                            label="Kestus sekundites"
                                            value={row.duration}
                                            onChange={(e) => handleRepertoryRowChange(e, index)}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="text"
                                            name="iswc"
                                            label="Repertuaarikood"
                                            value={row.iswc}
                                            onChange={(e) => handleRepertoryRowChange(e, index)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between" columnSpacing={2}>
                                <Grid item xs={4}>
                                    <Button type="button" variant="contained" onClick={addRepertoryRow}>
                                        Lisa rida
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button type="submit" variant="contained">
                                        Esita aruanne
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button type="button" variant="contained" onClick={handleShowJson} disabled={!repertoryId}>
                                        Näita JSONit
                                    </Button>
                                </Grid>
                                {repertoryJson && (
                                    <Grid item xs={12}>
                                        <pre>{JSON.stringify(repertoryJson, null, 2)}</pre>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
}

export default App;
