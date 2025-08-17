import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get details
  // data validation
  // check ffrom db if it is unique : username & email
  // check for images
  // check for avatar
  // upload to cloudinary , avatar
  // create user object
  // bcrtpy password
  // adding to db
  // remove password and refresh token feild from responce
  // check for user creation
  // return res

  // Get details
  const { fullName, email, userName, password } = req.body;
  console.log(req.body);

  // data validation
  if ([fullName, email, userName, password].some((field) => field === "")) {
    throw new ApiError(400, "All field are required");
  }

  // check for unique name and email
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) throw new ApiError(409, "userName or Email already existed");

  // get image files using multer
  console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // validate image files
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  // upload them on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // validate the uploaded file
  if (!avatar) throw new ApiError(400, "Avatar file is required");

  console.log(avatar);

  // create a user
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  // check if user created or not
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  // return the res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registed successfully"));
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // req body
  // username or email
  // find user
  // password check
  // access and refresh token
  // send cookies
  // send res

  const { email, userName, password } = req.body;

  if (!userName || !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "credentials is not valid ");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;
  const loggedInUserId = loggedInUser._id;

  await User.findByIdAndUpdate(
    loggedInUserId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export { registerUser, loginUser, logoutUser };
