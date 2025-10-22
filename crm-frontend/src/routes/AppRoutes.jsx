import { Routes, Route, Navigate } from 'react-router-dom';
import ContractsDashboard from '../components/ContractsDashboard';
import CreateContract from '../components/CreateContract';
import NotFound from '../components/NotFound';
import ContractsList from '../components/ContractsList';
import SubscriptionsList from '../components/SubscriptionsList';
import CreateReseller from '../components/CreateReseller';
import CreateCustomer from '../components/CreateCustomer';
import CreateSubscription from '../components/CreateSubscription';

const AppRoutes = () => {
    return (
        <Routes>
            <Route index path='/' element={<ContractsDashboard/>}/>
            <Route path='/contracts-dashboard' element={<ContractsDashboard/>}/>
            <Route path='/create-contract' element={<CreateContract/>}/>
            <Route path='/create-reseller' element={<CreateReseller/>}/>
            <Route path='/create-customer' element={<CreateCustomer/>}/>
            <Route path='/create-subscription' element={<CreateSubscription/>}/>
            <Route path='/contracts-list' element={<ContractsList/>}/>
            <Route path='/subscriptions-list' element={<SubscriptionsList/>}/>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes;