const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");
const passwordResetToken = require("../models/passwordResetToken");

exports.isValidPasswordResetToken = async (req, res, next) => {
    const { token, userId } = req.body;
    //isValidObjectId returns false if mongoose can not cast given value to an obj id
    if(!token.trim() || !isValidObjectId(userId)) return sendError(res, 'Unauthorized access, invalid request!')

    const resetToken = await passwordResetToken.findOne({owner: userId})
    if(!resetToken) return sendError(res, 'Unauthorized access!')

    const matched = await resetToken.compareToken(token)
    if(!matched) sendError(res, 'Token does not match token from email!')

    req.resetToken = resetToken
    next()
}