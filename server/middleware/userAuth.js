import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    // if token are not present in cookies
    if(!token) {
        return res.json({
            success: false,
            message: 'Not Authorized. Login Again'
        });
    }

    try {

        // decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // if id present in decoded token
        if(decodedToken.id) {
            req.body = req.body || {};
            req.body.userId = decodedToken.id;
        }
        else {
            return res.json({
                success: false,
                message: 'Not Authorized. Login Again'
            });
        }

        next();

    }
    catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

export default userAuth;

// {
//     "email": "abhayrajput9315@gmail.com",
//     "password": "abhay1234"
// }