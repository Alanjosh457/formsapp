
import { Routes, Route} from 'react-router-dom';



import Formspage from './Formspage';

import Createforms from './Createforms';
import Viewforms from './Viewforms';
import EditForm from './Editform';


import './App.css';



// Adjust the path as needed

const App = () => {

  // Redirect to long URL when short URL is visited



  return (
    <div>
  
      <Routes>
        {/* Define your routes */}
      
       
        <Route path="/" element={<Formspage />} />
        <Route path="/form/create" element={<Createforms/>} />
        <Route path="/form/:id" element={<Viewforms />} />
        <Route path="/form/:id/edit" element={<EditForm/>} />
      </Routes>
    </div>
  );
};

export default App;
