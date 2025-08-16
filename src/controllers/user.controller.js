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
  console.log(email);

  // data validation
  if (
    [fullName, email, userName, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All field are required");
  }

  // check for unique name and email
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) throw new ApiError(409, "userName or Email already existed");

  // get image files
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // validate image files
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  // upload them on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // validate the uploaded file
  if (!avatar) throw new ApiError(400, "Avatar file is required");

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

export { registerUser };
