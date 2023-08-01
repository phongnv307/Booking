import React, { Suspense, lazy } from "react";
import { Layout } from 'antd';
import { withRouter } from "react-router";
import Footer from '../components/layout/footer/footer';
import Header from '../components/layout/header/header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import NotFound from '../components/notFound/notFound';
import Sidebar from '../components/layout/sidebar/sidebar';
import LoadingScreen from '../components/loading/loadingScreen';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

const { Content } = Layout;

const Login = lazy(() => {
    return Promise.all([
        import('../pages/Login/login'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});



const AccountManagement = lazy(() => {
    return Promise.all([
        import('../pages/AccountManagement/accountManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});




const AccountCreate = lazy(() => {
    return Promise.all([
        import('../pages/AccountManagement/AccountCreate/accountCreate'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Notification = lazy(() => {
    return Promise.all([
        import('../pages/Notifications/notification'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ProductList = lazy(() => {
    return Promise.all([
        import('../pages/ProductList/productList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ToursList = lazy(() => {
    return Promise.all([
        import('../pages/ToursList/toursList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const RoomsList = lazy(() => {
    return Promise.all([
        import('../pages/RoomsList/roomsList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const DashBoard = lazy(() => {
    return Promise.all([
        import('../pages/DashBoard/dashBoard'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Profile = lazy(() => {
    return Promise.all([
        import('../pages/Profile/profile'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ChangePassword = lazy(() => {
    return Promise.all([
        import('../pages/ChangePassword/changePassword'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const OrderList = lazy(() => {
    return Promise.all([
        import('../pages/OrderList/orderList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const OrderRooms = lazy(() => {
    return Promise.all([
        import('../pages/OrderRooms/orderRooms'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Register = lazy(() => {
    return Promise.all([
        import('../pages/Register/register'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const RouterURL = withRouter(({ location }) => {

    const checkAuth = () => {
        return localStorage.getItem('role');
    }

    const LoginContainer = () => (
        <div>
            <PublicRoute exact path="/">
                <Suspense fallback={<LoadingScreen />}>
                    <Login />
                </Suspense>
            </PublicRoute>
            <PublicRoute exact path="/login">
                <Login />
            </PublicRoute>
            <PublicRoute exact path="/reset-password/:id">
                <ChangePassword />
            </PublicRoute>
            <PublicRoute exact path="/register">
                <Register />
            </PublicRoute>
        </div>
    )

    const DefaultContainer = () => (
        <PrivateRoute>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout >
                    <Header />
                    <Content style={{ marginLeft: 230, width: 'calc(100% - 230px)' }}>
                        <PrivateRoute exact path="/dash-board">
                            <Suspense fallback={<LoadingScreen />}>
                                <DashBoard />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/profile">
                            <Suspense fallback={<LoadingScreen />}>
                                <Profile />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/notfound">
                            <NotFound />
                        </PrivateRoute>

                        <PrivateRoute exact path="/account-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/account-create">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountCreate />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/notfound">
                            <NotFound /></PrivateRoute>

                        <PrivateRoute exact path="/notification">
                            <Suspense fallback={<LoadingScreen />}>
                                <Notification />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/hotel-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <ProductList />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/tours-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <ToursList />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/rooms-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <RoomsList />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/order-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrderList />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/order-rooms">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrderRooms />
                            </Suspense>
                        </PrivateRoute>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </PrivateRoute >
    )

    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/login">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/register">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/reset-password/:id">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/dash-board">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-create">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-approved">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-reject">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-detail/:id">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-edit/:id">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/organizing-event">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/organized-event">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/account-create">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/account-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/organizing-details/:id">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/organized-details/:id">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/notification">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/evaluation-form">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/hotel-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/tours-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/rooms-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/profile">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/order-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/order-rooms">
                        <DefaultContainer />
                    </Route>

                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
})

export default RouterURL;
