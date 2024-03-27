import React, { useState,useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { Grid, Stack, TextField, Select, MenuItem,Button,Modal } from '@mui/material';
import axios from 'axios';
import HdrAutoOutlinedIcon from '@mui/icons-material/HdrAutoOutlined';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PublicIcon from '@mui/icons-material/Public';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Fab from '@mui/material/Fab';
export default function CreateOrphanageForm() {
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    status: '',
    projectName: '',
    position: '',
    countrymodal:''

  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Empêche le rechargement de la page par défaut
    
    axios.post('http://localhost:8080/api/Orphanage/add', formData)
      .then(response => {
        console.log('Réponse de l\'API:', response.data);
        
        setFormData({
          country: '',
          city: '',
          status: '',
          projectName: '',
          position: '',
        });
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi du formulaire:', error);
      });
  };
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };





  const [openModalCity, setOpenModalCity] = useState(false);
  const handleOpenModalCity = () => {
    setOpenModalCity(true);
  };
  const handleCloseModalCity = () => {
    setOpenModalCity(false);
  };
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/countries')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des pays:', error);
      });
  }, []);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cities, setCities] = useState([]);
  useEffect(() => {
    if (selectedCountry !== '') {
      axios.get(`http://localhost:8080/admin/villes`)
        .then(response => {
          const filteredCities = response.data.filter(city => city.country.nomFr === selectedCountry);
          setCities(filteredCities);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des villes:', error);
        });
    }
  }, [selectedCountry]);


  const handleAddCity = () => {
    // Construire l'objet à envoyer avec la demande d'ajout de ville
    const cityData = {
      country: formData.country,
      city: formData.city,
    };
  
    // Envoyer la demande d'ajout de ville avec le pays sélectionné
    axios.post('http://localhost:8080/admin/ville/add', cityData)
      .then(response => {
        console.log('Ville ajoutée avec succès:', response.data);
        // Réinitialiser le formulaire ou effectuer d'autres actions si nécessaire
        setFormData({
          ...formData,
          city: '', // Réinitialiser le champ de la ville
        });
        handleCloseModalCity(); // Fermer la modal après l'ajout de la ville
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de la ville:', error);
      });
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ padding: '3%', maxWidth: '90%', boxShadow: '0 3px 14px rgba(0, 0, 0, 0.2)', borderRadius: '2%' }}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ color: '#AB7442', textAlign: 'center'}}>Ajouter un projet</h2>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={3}>
              <Select
  name="country"
  value={selectedCountry}
  onChange={(event) => setSelectedCountry(event.target.value)}
  startAdornment={
    <InputAdornment position="start">
      <PublicIcon />
    </InputAdornment>
  }
  displayEmpty 
  renderValue={(selected) => (selected ? selected : 'Sélectionnez un pays')} 
>
  <MenuItem value="" disabled>
    Sélectionnez un pays
  </MenuItem>
  {countries.map(country => (
    <MenuItem key={country.id} value={country.nomFr}>
      {country.nomFr}
    </MenuItem>
  ))}
</Select>

  <Fab size="small" onClick={handleOpenModal} style={{color:"white",backgroundColor:"#AB7442"}} aria-label="add" >
  <AddIcon/>
</Fab>


<Select
  name="city"
  value={formData.city}
  onChange={handleInputChange}
  startAdornment={
    <InputAdornment position="start">
      <LocationCityIcon />
    </InputAdornment>
  }
  displayEmpty 
  renderValue={(selected) => (selected ? selected : 'Sélectionnez une ville')} 
>
  <MenuItem value="" disabled>
    Sélectionnez une ville
  </MenuItem>
  {cities.map(city => (
    <MenuItem key={city.id} value={city.nameFr}>
      {city.nameFr}
    </MenuItem>
  ))}
</Select>

                  <Fab size="small" onClick={handleOpenModalCity}  style={{color:"white",backgroundColor:"#AB7442"}} aria-label="add" >
  <AddIcon/>
</Fab>
                <TextField
                  type="text"
                  label="Status"
                  variant="outlined"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  sx={{
                    '&:focus .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#AB7442', 
                    },
                    '& .MuiInputLabel-root': {
                      color: 'grey', 
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DoneAllIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="text"
                  label="Nom du projet"
                  variant="outlined"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  sx={{
                    '&:focus .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#AB7442', 
                    },
                    '& .MuiInputLabel-root': {
                      color: 'grey', 
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HdrAutoOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="text"
                  label="Position"
                  variant="outlined"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  sx={{
                    '&:focus .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#AB7442', 
                    },
                    '& .MuiInputLabel-root': {
                      color: 'grey', 
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RoomOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="text"
                  label="Image"
                  variant="outlined"
                  name="image"
         
                  sx={{
                    '&:focus .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#AB7442', 
                    },
                    '& .MuiInputLabel-root': {
                      color: 'grey', 
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AddPhotoAlternateOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" variant="contained" style={{ backgroundColor: '#AB7442' }}>Ajouter</Button>
              </div>
            </Grid>
          </Grid>
        </form>
        <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '40%',  height: '30%',  display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <CloseIcon onClick={handleCloseModal} style={{ color: '#AB7442', cursor: 'pointer' }} />
    </div>
    <h2 id="modal-modal-title" style={{ color: '#AB7442', textAlign: 'center', width: '100%' }}>Ajouter un pays</h2>
    <TextField
      type="text"
      label="Pays"
      variant="outlined"
      name="country"
      value={formData.countrymodal}
      onChange={handleInputChange}
      sx={{
        '&:focus .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
          borderColor: '#AB7442',
        },
        '& .MuiInputLabel-root': {
          color: 'grey',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PublicIcon />
          </InputAdornment>
        ),
      }}
    />
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>

      <Button onClick={handleCloseModal} variant="contained" style={{ backgroundColor: '#AB7442', color: 'white',textAlign: 'center' }}>
        Ajouter
      </Button>
    </div>
  </div>
</Modal>





<Modal open={openModalCity} onClose={handleCloseModalCity} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '50%', /* Removed height style */ }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <CloseIcon onClick={handleCloseModalCity} style={{ color: '#AB7442', cursor: 'pointer' }} />
    </div>
    <h2 id="modal-modal-title" style={{ color: '#AB7442', textAlign: 'center', width: '100%' }}>Ajouter une ville</h2>
    
    <div style={{ marginBottom: '1rem', width: '100%' }}>
      <Select
        name="country"
        value={formData.country}
        onChange={handleInputChange}
        fullWidth // Added fullWidth style
        displayEmpty 
        renderValue={(selected) => (selected ? selected : 'Sélectionnez un pays')} 
      >
        <MenuItem value="" disabled>
          Sélectionnez un pays
        </MenuItem>
        {countries.map(country => (
          <MenuItem key={country.id} value={country.nomFr}>
            {country.nomFr}
          </MenuItem>
        ))}
      </Select>
    </div>
    <TextField
      type="text"
      label="Ville"
      variant="outlined"
      name="city"
      value={formData.city}
      onChange={handleInputChange}
      sx={{
        '&:focus .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
          borderColor: '#AB7442', 
        },
        '& .MuiInputLabel-root': {
          color: 'grey', 
        },
        marginBottom: '1rem' // Ajout de la marge basse pour l'espacement
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocationCityIcon />
          </InputAdornment>
        ),
      }}
    />
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
      <Button onClick={handleAddCity} variant="contained" style={{ backgroundColor: '#AB7442', color: 'white', textAlign: 'center' }}>
        Ajouter
      </Button>
    </div>
  </div>
</Modal>





      </div>
    </div>
  );
}
