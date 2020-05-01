import Amplify, {Auth} from "aws-amplify";

export const ApiName = "AdminApi";
export const ServerlessMode = true;

const AmplifyService = {
    configure() {

        let endpointUrl = process.env.VUE_APP_AMPLIFY_ADMIN_API_ENDPOINT_URL;

        Amplify.configure({
            Auth: {
                identityPoolId: process.env.VUE_APP_AMPLIFY_AUTH_IDENTITY_POOL_ID,
                region: process.env.VUE_APP_AMPLIFY_AUTH_REGION,
                userPoolId: process.env.VUE_APP_AMPLIFY_AUTH_USER_POOL_ID,
                userPoolWebClientId: process.env.VUE_APP_AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID,
                identityPoolRegion: process.env.VUE_APP_DEPLOY_AWS_REGION,
            },
            API: {
                endpoints: [
                    {
                        name: ApiName,
                        endpoint: endpointUrl,
                        region: process.env.VUE_APP_AMPLIFY_AUTH_REGION,
                    }
                ]
            }
        });
    }
};

class AppUser {

    constructor(username, email, groups) {
        this.username = username;
        this.email = email;
        this.groups = groups || [];
    }

    static fromCognitoUser = (cognitoUser) => {
        if (!cognitoUser) {
            return new AppUser("", "", [])
        }
        let session = cognitoUser.signInUserSession;
        if (!session) return null;
        let payload = session.idToken.payload;
        return new AppUser(
            payload['cognito:username'],
            payload['email'],
            payload['cognito:groups'],
        );
    };

    get isAdmin() {
        return this.groups.includes("admins");
    }

    get isMember() {
        return this.groups.includes("members");
    }

    get isAnonymous() {
        return !this.username;
    }
}

let currentUser = AppUser.fromCognitoUser(undefined);

const getCurrentUser = () => {
    Auth.currentAuthenticatedUser().then((user) => {
        setCurrentUser(user);
    });
    return currentUser;
};

const refreshUserInfo = async () => {
    const user = await Auth.currentAuthenticatedUser();
    setCurrentUser(user);
    return getCurrentUser();
};

const setCurrentUser = (authenticatedUser) => {
    if (authenticatedUser) {
        currentUser = AppUser.fromCognitoUser(authenticatedUser);
    } else {
        currentUser = AppUser.fromCognitoUser(undefined);
    }
};

const getApiPath = (path) => {
    const user = getCurrentUser();
    let prefix = "/db_guest";
    if (user.isAdmin) {
        prefix = "/db"
    } else if (user.isMember) {
        prefix = "/db_member"
    }
    return !!path && path[0] === "/" ? `${prefix}${path}` : `${prefix}/${path}`;
};

export {AmplifyService, ApiName as ADMIN_API, getCurrentUser, AppUser, setCurrentUser, getApiPath, refreshUserInfo}
