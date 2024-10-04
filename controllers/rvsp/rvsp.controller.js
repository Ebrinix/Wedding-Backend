const axios = require("axios").default;

const { errorResponse, successResponse } = require("../../helpers");
const db = require("../../config/sequelize");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const fs = require('fs');
const path = require('path');
var { Rvsp, UploadImage } = require("../../models");
// const { differenceInHours } = require("date-fns");


const registerForEvent = async (req, res) => {
  const { groupName, numberOfInvites } = req.body;

  try {
    // console.log(txnId);
    const findEvent = await Rvsp.findOne({
      where: {
        groupName,
      },
    });

    console.log(findEvent);
    if (findEvent) {
      throw new Error("Invitation already exist.");
    }

    const randomCodes = generateRandomCodes(numberOfInvites);

    console.log(randomCodes);

    let payload = {
        groupName: groupName,
        numberOfInvites: numberOfInvites,
        accessCodes: randomCodes,
        approve: "TRUE",
    }

    const registerEvent = await Rvsp.create(payload);

    return successResponse(req, res, {
        message: "Wedding invitation created successfully"
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const submitInviteeResponse  = async (req, res) => {
  const { id, isAttending } = req.body;

  console.log(req.body);
  try {
    // console.log(txnId);
    const findEvent = await Rvsp.findOne({
      where: {
        id,
      },
    });

    if (!findEvent) {
        throw new Error("Invitation does not exist.");
      }

    await Rvsp.update(
        { isAttending },
        { where: { id } }
      );

    return successResponse(req, res, {
        message: "Attendance status updated successfully"
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// Admin
const changeApprovalStatus = async (req, res) => {
    const { id, action } = req.body;
  
    console.log(req.body);
  
    try {
      // Find the event by the id
      const findEvent = await Rvsp.findOne({
        where: {
          id,
        },
      });
  
      // Throw an error if the event does not exist
      if (!findEvent) {
        throw new Error("Invitation does not exist.");
      }

    let regularArray = findEvent.map(asset => asset.get({ plain: true }));

    console.log(regularArray);
  
      // Update the approval status
      await Rvsp.update(
        { approve: action },
        { where: { id } }
      );
  
      return successResponse(req, res, {
        message: "Approval status updated successfully", // Updated the message
      });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
};

// Admin
const verifyAccessCode = async (req, res) => {
    const { accessCode } = req.body;
  
    console.log(req.body);
  
    try {
      // Find the event by the id
    //   const findEvent = await Rvsp.findOne({
    //     where: {
    //       id,
    //     },
    //   });
  
      // Throw an error if the event does not exist
      
    const findCode = await Rvsp.findOne({
        where: {
            // id,
            accessCodes: {
                [Op.like]: `%${accessCode}%`
            }
        }
    });

    if (!findCode) {
        throw new Error("Access code does not exist.");
    }

      console.log(findCode);
      
  
      // Update the approval status
    //   await Rvsp.update(
    //     { approve: action },
    //     { where: { id } }
    //   );
  
      return successResponse(req, res, {
        message: "Access code exists", // Updated the message
        data: findCode
      });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
};

// Admin
const authenticateAccessCode = async (req, res) => {
    const { accessCode } = req.body;
  
    console.log(req.body);
  
    try {
      // Throw an error if the event does not exist
      
        const findCode = await Rvsp.findOne({
            where: {
                accessCodes: {
                    [Op.like]: `%${accessCode}%`
                }
            }
        });

        if (!findCode) {
            throw new Error("Access code does not exist.");
        }
      
        const isApproved = await Rvsp.findOne({
            where: {
                approvedAccessCodes: {
                    [Op.like]: `%${accessCode}%`
                }
            }
        });

        if (isApproved) {
            throw new Error("Access code already approved.");
        }

        // console.log(findCode);

        let approvedAccessCode = '';
        
        if (findCode.approvedAccessCodes == null) {
            console.log("Is Null");
            approvedAccessCode = accessCode;
        } else {
            console.log("Is not Null");
            approvedAccessCode = findCode.approvedAccessCodes+'-'+ accessCode;
        }

        console.log(approvedAccessCode);
    
        // Update the approval status
          await Rvsp.update(
            { approvedAccessCodes: approvedAccessCode },
            { where: { id: findCode.id } }
          );
  
      return successResponse(req, res, {
        message: "Access code exists", // Updated the message
        data: findCode
      });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
};

// Admin
const fetchAllInvitations = async (req, res) => {
    // const { id, action } = req.body;
  
    console.log(req.body);
  
    try {
      // Find the event by the id
      const findEvent = await Rvsp.findAll();
  
      // Throw an error if the event does not exist
      if (!findEvent) {
        throw new Error("No Invitations Found.");
      }

      return successResponse(req, res, {
        data: findEvent
        // message: "Approval status updated successfully", // Updated the message
      });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
};

const uploadImages = async (req, res) => {
    try {
        // console.log(req, "fkee");
        // Check if any files were provided
        if (!req.files || Object.keys(req.files).length === 0) {
            throw new Error("Please supply at least one product image");
        }
    
        // Check if number of files is between 1 and 10
        const fileKeys = Object.keys(req.files);

      
        if (fileKeys.length < 1 || fileKeys.length > 10) {
            throw new Error("Please supply between 1 and 10 product images");
        }
    
        const imagePaths = [];
        const base64Contents = [];
    
        for (const key of fileKeys) {
            const productImages = req.files[key];
    
            // Check if `productImages` is an array (multiple files for the same key)
            const imagesArray = Array.isArray(productImages) ? productImages : [productImages];
    
            for (const productImage of imagesArray) {
            // Generate a unique file name
            const fileName = new Date().getTime().toString() + key + path.extname(productImage.name);
            const savePath = path.join(__dirname, "..", "..", "public", "images", fileName);
    
            // Move the file to the server
            await productImage.mv(savePath);

            // Add the file path for any further use
            imagePaths.push(savePath);

            let payload = {
                image: fileName,
                status: "DECLINE"
            }
            await UploadImage.create(payload);
    
            // Read file and convert to base64
            const base64Content = fs.readFileSync(savePath, { encoding: "base64" });
            base64Contents.push(base64Content);
            }
        }

        // Process the images as needed (e.g., store image paths or base64 content in the database)
  
        return successResponse(req, res, {
            message: `${imagePaths.length} product image(s) uploaded successfully`,
            images: imagePaths, // Returning the paths of the uploaded images
        });
    } catch (error) {
      console.error(error);
      return errorResponse(req, res, error.message);
    }
};

// Admin
const updateImageStatus  = async (req, res) => {
    const { id, status } = req.body;
  
    // console.log(req.body);
    try {
      // console.log(txnId);
      const findEvent = await UploadImage.findOne({
        where: {
          id,
        },
      });
  
      if (!findEvent) {
          throw new Error("Image does not exist.");
        }
  
      await UploadImage.update(
          { status },
          { where: { id } }
        );
  
      return successResponse(req, res, {
          message: "Image status updated successfully"
      });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
};

// Admin
const fetchAllImages = async (req, res) => {
    // const { id, action } = req.body;
  
    console.log(req.body);
  
    try {
      // Find the event by the id
      const findEvent = await UploadImage.findAll();
  
      // Throw an error if the event does not exist
      if (!findEvent) {
        throw new Error("No image Found.");
      }

      return successResponse(req, res, {
        data: findEvent
        // message: "Approval status updated successfully", // Updated the message
      });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
};


const fetchAllApprovedImages = async (req, res) => {
    // const { id, action } = req.body;
  
    console.log(req.body);
  
    try {
      // Find the event by the id
      const findEvent = await UploadImage.findAll({
        where: {
            status: "APPROVE"
        }
      });
  
      // Throw an error if the event does not exist
      if (!findEvent) {
        throw new Error("No image Found.");
      }

      return successResponse(req, res, {
        data: findEvent
        // message: "Approval status updated successfully", // Updated the message
      });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
};  

function generateRandomCodes(numOfCodes) {
    // const codes = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 8;
    let result = '';

    for (let i = 0; i < numOfCodes; i++) {
        let code = '';
        for (let j = 0; j < codeLength; j++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }

        result += code;
        
        // Add a hyphen between codes, but avoid adding it after the last code
        if (i < numOfCodes - 1) {
            result += '-';
        }
    }

    return result;
}

module.exports = {
  registerForEvent,
  submitInviteeResponse,
  changeApprovalStatus,
  verifyAccessCode,
  authenticateAccessCode,
  fetchAllInvitations,
  uploadImages,
  updateImageStatus,
  fetchAllImages,
  fetchAllApprovedImages
//   initialAdd
};
