// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext'; // Firebase auth context
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // District-soil color mapping data
// const DISTRICT_SOIL_MAP = {
//   "district_soil_map": {
//     "Kancheepuram": {
//       "Red": {"N": 35, "P": 25, "K": 65, "pH": 6.2},
//       "Clay": {"N": 60, "P": 40, "K": 95, "pH": 6.8},
//       "Coastal": {"N": 30, "P": 20, "K": 110, "pH": 8.0}
//     },
//     // All other districts and soil types as in your JSON
//     // ...truncated for brevity
//   },
//   "soil_color_map": {
//     "Red Sandy Loam": "Red",
//     "Red": "Red",
//     "Clay Loam": "Clay",
//     "Clay": "Clay", 
//     // All other soil color mappings as in your JSON
//     // ...truncated for brevity
//   }
// };

// const FarmerRegistrationForm = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [step, setStep] = useState(1); // Multi-step form
  
//   // Farmer personal info
//   const [farmerInfo, setFarmerInfo] = useState({
//     name: '',
//     age: '',
//     district: '',
//     state: ''
//   });
  
//   // Land details
//   const [landInfo, setLandInfo] = useState({
//     crops: [''],
//     soilColor: '',
//     district: '',
//     state: '',
//     location: {
//       type: 'Point',
//       coordinates: [0, 0] // [longitude, latitude]
//     },
//     soilProperties: {
//       nitrogen: 0,
//       phosphorous: 0,
//       potassium: 0,
//       pH: 0
//     },
//     environmentalConditions: {
//       humidity: 0,
//       rainfall: 0,
//       temperature: 0
//     }
//   });
  
//   // For soil report upload
//   const [soilReport, setSoilReport] = useState(null);
//   const [reportUploadOption, setReportUploadOption] = useState('manual'); // 'manual' or 'upload'
  
//   // Check if user already registered
//   useEffect(() => {
//     const checkUserRegistration = async () => {
//       if (currentUser) {
//         try {
//           // Check MongoDB for existing farmer profile using Firebase UID
//           const response = await axios.get(`/api/farmers/${currentUser.uid}`);
          
//           if (response.data && !response.data.error) {
//             // User already registered, redirect to dashboard
//             navigate('/dashboard');
//           }
//         } catch (error) {
//           // If 404, user not registered yet, which is fine
//           if (error.response && error.response.status !== 404) {
//             console.error("Error checking user registration:", error);
//           }
//         }
//       }
//     };
    
//     checkUserRegistration();
//   }, [currentUser, navigate]);
  
//   // Handle input changes for farmer info
//   const handleFarmerInfoChange = (e) => {
//     const { name, value } = e.target;
//     setFarmerInfo({
//       ...farmerInfo,
//       [name]: value
//     });
//   };
  
//   // Handle input changes for land info
//   const handleLandInfoChange = (e) => {
//     const { name, value } = e.target;
    
//     // Handle nested properties
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setLandInfo({
//         ...landInfo,
//         [parent]: {
//           ...landInfo[parent],
//           [child]: value
//         }
//       });
//     } else {
//       setLandInfo({
//         ...landInfo,
//         [name]: value
//       });
//     }
//   };
  
//   // Handle crop input (array)
//   const handleCropChange = (index, value) => {
//     const updatedCrops = [...landInfo.crops];
//     updatedCrops[index] = value;
//     setLandInfo({
//       ...landInfo,
//       crops: updatedCrops
//     });
//   };
  
//   // Add a new crop input field
//   const addCropField = () => {
//     setLandInfo({
//       ...landInfo,
//       crops: [...landInfo.crops, '']
//     });
//   };
  
//   // Remove a crop input field
//   const removeCropField = (index) => {
//     const updatedCrops = [...landInfo.crops];
//     updatedCrops.splice(index, 1);
//     setLandInfo({
//       ...landInfo,
//       crops: updatedCrops
//     });
//   };
  
//   // Handle soil report file upload
//   const handleFileUpload = (e) => {
//     setSoilReport(e.target.files[0]);
//   };
  
//   // Get NPK values based on district and soil color
//   const getNPKValues = () => {
//     const district = landInfo.district;
//     const soilColorInput = landInfo.soilColor;
    
//     // Normalize soil color using the mapping
//     const normalizedSoilColor = DISTRICT_SOIL_MAP.soil_color_map[soilColorInput] || soilColorInput;
    
//     if (
//       DISTRICT_SOIL_MAP.district_soil_map[district] && 
//       DISTRICT_SOIL_MAP.district_soil_map[district][normalizedSoilColor]
//     ) {
//       const soilData = DISTRICT_SOIL_MAP.district_soil_map[district][normalizedSoilColor];
//       setLandInfo({
//         ...landInfo,
//         soilProperties: {
//           nitrogen: soilData.N,
//           phosphorous: soilData.P,
//           potassium: soilData.K,
//           pH: soilData.pH
//         }
//       });
//       setMessage("NPK values updated based on district and soil color");
//     } else {
//       setMessage("No soil data available for the selected district and soil color");
//     }
//   };
  
//   // Get coordinates using your FastAPI endpoint
//   const getCoordinates = async () => {
//     try {
//       setIsLoading(true);
//       setMessage("Fetching location coordinates...");
      
//       const placeQuery = `${landInfo.district}, ${landInfo.state}`;
//       const response = await axios.get(`/api/coordinates?place=${encodeURIComponent(placeQuery)}`);
      
//       if (response.data && !response.data.error) {
//         // Update the location in state
//         const { latitude, longitude } = response.data;
//         setLandInfo({
//           ...landInfo,
//           location: {
//             type: 'Point',
//             coordinates: [parseFloat(longitude), parseFloat(latitude)]
//           }
//         });
        
//         // Return the coordinates for the next function
//         return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
//       } else {
//         setMessage(response.data.error || "Failed to fetch coordinates");
//         setIsLoading(false);
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//       setMessage("Failed to fetch location coordinates. Please try again.");
//       setIsLoading(false);
//       return null;
//     }
//   };
  
//   // Get environmental conditions using your FastAPI endpoint
//   const getEnvironmentalData = async (coordinates) => {
//     if (!coordinates) return;
    
//     try {
//       setMessage("Fetching environmental conditions...");
      
//       const response = await axios.get(
//         `/api/environmental_conditions?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
//       );
      
//       if (response.data && !response.data.error) {
//         setLandInfo({
//           ...landInfo,
//           environmentalConditions: {
//             humidity: response.data.humidity,
//             rainfall: response.data.rainfall,
//             temperature: response.data.temperature
//           }
//         });
//         setMessage("Location coordinates and environmental data updated successfully");
//       } else {
//         setMessage(response.data.error || "Failed to fetch environmental conditions");
//       }
      
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching environmental data:", error);
//       setMessage("Failed to fetch environmental conditions. Please try again.");
//       setIsLoading(false);
//     }
//   };
  
//   // Combined function to get both location and environmental data
//   const getLocationData = async () => {
//     const coordinates = await getCoordinates();
//     if (coordinates) {
//       await getEnvironmentalData(coordinates);
//     }
//   };
  
//   // Process soil report using OCR
//   const processSoilReport = async () => {
//     if (!soilReport) {
//       setMessage("Please upload a soil report first");
//       return;
//     }
    
//     try {
//       setIsLoading(true);
//       setMessage("Processing soil report...");
      
//       // Create form data for file upload
//       const formData = new FormData();
//       formData.append('file', soilReport);
      
//       // Send to your OCR API endpoint
//       const response = await axios.post('/api/process-soil-report', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
      
//       if (response.data && response.data.soilProperties) {
//         setLandInfo({
//           ...landInfo,
//           soilProperties: response.data.soilProperties
//         });
//         setMessage("Soil report processed successfully");
//       } else {
//         setMessage("Could not extract soil properties from the report");
//       }
      
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error processing soil report:", error);
//       setMessage("Failed to process soil report. Please try manual entry.");
//       setIsLoading(false);
//     }
//   };
  
//   // Submit the form to MongoDB
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     try {
//       // Save farmer info to MongoDB
//       const farmerData = {
//         uid: currentUser.uid, // Firebase UID as reference
//         name: farmerInfo.name,
//         age: parseInt(farmerInfo.age),
//         district: farmerInfo.district,
//         state: farmerInfo.state,
//         email: currentUser.email // Get email from Firebase user
//       };
      
//       // Save farmer profile to MongoDB
//       const farmerResponse = await axios.post('/api/farmers', farmerData);
      
//       if (farmerResponse.data && farmerResponse.data._id) {
//         // Save land info to MongoDB
//         const landData = {
//           farmerId: farmerResponse.data._id, // MongoDB _id of farmer
//           ownerId: currentUser.uid, // Firebase UID
//           crops: landInfo.crops.filter(crop => crop.trim() !== ''),
//           soilColor: landInfo.soilColor,
//           district: landInfo.district,
//           state: landInfo.state,
//           location: landInfo.location,
//           soilProperties: landInfo.soilProperties,
//           environmentalConditions: landInfo.environmentalConditions
//         };
        
//         // Save land to MongoDB
//         await axios.post('/api/lands', landData);
        
//         setMessage("Registration completed successfully!");
//         navigate('/dashboard');
//       } else {
//         throw new Error("Failed to create farmer profile");
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       setMessage("Failed to complete registration. Please try again.");
//     }
    
//     setIsLoading(false);
//   };
  
//   // Render different form steps
//   const renderFormStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <div className="form-step">
//             <h2>Personal Information</h2>
//             <div className="form-group">
//               <label htmlFor="name">Full Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={farmerInfo.name}
//                 onChange={handleFarmerInfoChange}
//                 required
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="age">Age</label>
//               <input
//                 type="number"
//                 id="age"
//                 name="age"
//                 value={farmerInfo.age}
//                 onChange={handleFarmerInfoChange}
//                 required
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="state">State</label>
//               <input
//                 type="text"
//                 id="state"
//                 name="state"
//                 value={farmerInfo.state}
//                 onChange={handleFarmerInfoChange}
//                 required
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="district">District</label>
//               <input
//                 type="text"
//                 id="district"
//                 name="district"
//                 value={farmerInfo.district}
//                 onChange={handleFarmerInfoChange}
//                 required
//               />
//             </div>
            
//             <button 
//               type="button" 
//               onClick={() => setStep(2)} 
//               disabled={!farmerInfo.name || !farmerInfo.age || !farmerInfo.district || !farmerInfo.state}
//               className="next-button"
//             >
//               Next
//             </button>
//           </div>
//         );
        
//       case 2:
//         return (
//           <div className="form-step">
//             <h2>Land Information</h2>
            
//             <div className="form-group">
//               <label htmlFor="landDistrict">District</label>
//               <input
//                 type="text"
//                 id="landDistrict"
//                 name="district"
//                 value={landInfo.district}
//                 onChange={handleLandInfoChange}
//                 required
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="landState">State</label>
//               <input
//                 type="text"
//                 id="landState"
//                 name="state"
//                 value={landInfo.state}
//                 onChange={handleLandInfoChange}
//                 required
//               />
//             </div>
            
//             <div className="form-group">
//               <label>Crops</label>
//               {landInfo.crops.map((crop, index) => (
//                 <div key={index} className="crop-input">
//                   <input
//                     type="text"
//                     value={crop}
//                     onChange={(e) => handleCropChange(index, e.target.value)}
//                     placeholder="Enter crop name"
//                   />
//                   {index > 0 && (
//                     <button 
//                       type="button" 
//                       onClick={() => removeCropField(index)}
//                       className="remove-button"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button 
//                 type="button" 
//                 onClick={addCropField}
//                 className="add-button"
//               >
//                 Add Crop
//               </button>
//             </div>
            
//             <div className="button-group">
//               <button 
//                 type="button" 
//                 onClick={() => setStep(1)}
//                 className="prev-button"
//               >
//                 Previous
//               </button>
//               <button 
//                 type="button" 
//                 onClick={() => setStep(3)}
//                 className="next-button"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         );
        
//       case 3:
//         return (
//           <div className="form-step">
//             <h2>Soil Properties</h2>
            
//             <div className="option-selector">
//               <label>
//                 <input
//                   type="radio"
//                   name="reportUploadOption"
//                   value="manual"
//                   checked={reportUploadOption === 'manual'}
//                   onChange={() => setReportUploadOption('manual')}
//                 />
//                 Enter soil details manually
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="reportUploadOption"
//                   value="upload"
//                   checked={reportUploadOption === 'upload'}
//                   onChange={() => setReportUploadOption('upload')}
//                 />
//                 Upload soil report
//               </label>
//             </div>
            
//             {reportUploadOption === 'manual' ? (
//               <div className="manual-entry">
//                 <div className="form-group">
//                   <label htmlFor="soilColor">Soil Color</label>
//                   <select
//                     id="soilColor"
//                     name="soilColor"
//                     value={landInfo.soilColor}
//                     onChange={handleLandInfoChange}
//                     required
//                   >
//                     <option value="">Select Soil Color</option>
//                     {Object.keys(DISTRICT_SOIL_MAP.soil_color_map).map(color => (
//                       <option key={color} value={color}>{color}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <button 
//                   type="button" 
//                   onClick={getNPKValues} 
//                   disabled={!landInfo.district || !landInfo.soilColor}
//                   className="action-button"
//                 >
//                   Get NPK Values
//                 </button>
                
//                 <div className="form-group">
//                   <label htmlFor="nitrogen">Nitrogen (N)</label>
//                   <input
//                     type="number"
//                     id="nitrogen"
//                     name="soilProperties.nitrogen"
//                     value={landInfo.soilProperties.nitrogen}
//                     onChange={handleLandInfoChange}
//                     required
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label htmlFor="phosphorous">Phosphorous (P)</label>
//                   <input
//                     type="number"
//                     id="phosphorous"
//                     name="soilProperties.phosphorous"
//                     value={landInfo.soilProperties.phosphorous}
//                     onChange={handleLandInfoChange}
//                     required
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label htmlFor="potassium">Potassium (K)</label>
//                   <input
//                     type="number"
//                     id="potassium"
//                     name="soilProperties.potassium"
//                     value={landInfo.soilProperties.potassium}
//                     onChange={handleLandInfoChange}
//                     required
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label htmlFor="pH">pH Level</label>
//                   <input
//                     type="number"
//                     id="pH"
//                     name="soilProperties.pH"
//                     value={landInfo.soilProperties.pH}
//                     onChange={handleLandInfoChange}
//                     step="0.1"
//                     required
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="report-upload">
//                 <div className="form-group">
//                   <label htmlFor="soilReport">Upload Soil Report</label>
//                   <input
//                     type="file"
//                     id="soilReport"
//                     accept=".pdf,.jpg,.jpeg,.png"
//                     onChange={handleFileUpload}
//                   />
//                 </div>
                
//                 <button 
//                   type="button" 
//                   onClick={processSoilReport} 
//                   disabled={!soilReport}
//                   className="action-button"
//                 >
//                   Process Report
//                 </button>
//               </div>
//             )}
            
//             <div className="button-group">
//               <button 
//                 type="button" 
//                 onClick={() => setStep(2)}
//                 className="prev-button"
//               >
//                 Previous
//               </button>
//               <button 
//                 type="button" 
//                 onClick={() => setStep(4)}
//                 className="next-button"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         );
        
//       case 4:
//         return (
//           <div className="form-step">
//             <h2>Environmental Conditions</h2>
            
//             <button 
//               type="button" 
//               onClick={getLocationData} 
//               disabled={!landInfo.district || !landInfo.state}
//               className="action-button"
//             >
//               Get Location & Climate Data
//             </button>
            
//             <div className="form-group">
//               <label htmlFor="longitude">Longitude</label>
//               <input
//                 type="number"
//                 id="longitude"
//                 value={landInfo.location.coordinates[0]}
//                 readOnly
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="latitude">Latitude</label>
//               <input
//                 type="number"
//                 id="latitude"
//                 value={landInfo.location.coordinates[1]}
//                 readOnly
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="temperature">Temperature (°C)</label>
//               <input
//                 type="number"
//                 id="temperature"
//                 name="environmentalConditions.temperature"
//                 value={landInfo.environmentalConditions.temperature}
//                 onChange={handleLandInfoChange}
//                 required
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="humidity">Humidity (%)</label>
//               <input
//                 type="number"
//                 id="humidity"
//                 name="environmentalConditions.humidity"
//                 value={landInfo.environmentalConditions.humidity}
//                 onChange={handleLandInfoChange}
//                 required
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="rainfall">Annual Rainfall (mm)</label>
//               <input
//                 type="number"
//                 id="rainfall"
//                 name="environmentalConditions.rainfall"
//                 value={landInfo.environmentalConditions.rainfall}
//                 onChange={handleLandInfoChange}
//                 required
//               />
//             </div>
            
//             <div className="button-group">
//               <button 
//                 type="button" 
//                 onClick={() => setStep(3)}
//                 className="prev-button"
//               >
//                 Previous
//               </button>
//               <button 
//                 type="submit"
//                 className="submit-button"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         );
        
//       default:
//         return null;
//     }
//   };
  
//   return (
//     <div className="farmer-registration-container">
//       <h1>Complete Your Profile</h1>
//       <p>Please provide the following information to complete your registration</p>
      
//       {message && <div className="alert">{message}</div>}
      
//       <form onSubmit={handleSubmit}>
//         {renderFormStep()}
//       </form>
      
//       {isLoading && <div className="loading-spinner">Loading...</div>}
//     </div>
//   );
// };

// export default FarmerRegistrationForm;