import { Routes, Route, Navigate } from 'react-router-dom';
import ContractsDashboard from '../components/ContractsDashboard';
import CreateContract from '../components/CreateContract';
import NotFound from '../components/NotFound';
import ContractsList from '../components/ContractsList';

const AppRoutes = () => {
    return (
        <Routes>
            <Route index path='/' element={<ContractsDashboard/>}/>
            <Route path='/contracts-dashboard' element={<ContractsDashboard/>}/>
            <Route path='/create-contract' element={<CreateContract/>}/>
            <Route path='/contracts-list' element={<ContractsList/>}/>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes;