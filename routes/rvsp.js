const express = require("express");
const router = express.Router();
const validate = require("express-validation");

const rvspController = require("../controllers/rvsp/rvsp.controller");

router.post(
    "/create-invitation",
    rvspController.registerForEvent
);
router.post(
    "/respond-to-invitation",
    rvspController.submitInviteeResponse
);

router.post(
    "/change-invitation-status",
    rvspController.changeApprovalStatus
);

router.post(
    "/verify-access-code",
    rvspController.verifyAccessCode
);

router.post(
    "/authorize-access-code",
    rvspController.authenticateAccessCode
);

router.get(
    "/fetch-all-invitations",
    rvspController.fetchAllInvitations
);


module.exports = router;
