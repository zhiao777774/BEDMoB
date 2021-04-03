import React from 'react';
import Router from 'next/router';


const withPrivateRoute = (WrappedComponent, redirectPage) => {
    const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

    hocComponent.getInitialProps = async (context) => {
        const data = context.query;
        const userAuth = data.auth;

        // Are you an authorized user or not?
        if (!userAuth) {
            // Handle server-side and client-side rendering.
            if (context.res) {
                context.res?.writeHead(302, {
                    Location: redirectPage,
                });
                context.res?.end();
            } else {
                Router.replace(redirectPage);
            }
        } else if (WrappedComponent.getInitialProps) {
            const wrappedProps = await WrappedComponent.getInitialProps({ ...context, auth: userAuth });
            return { ...wrappedProps, ...data };
        }

        return { ...data };
    };

    return hocComponent;
};

export default withPrivateRoute;