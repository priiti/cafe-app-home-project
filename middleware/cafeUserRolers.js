exports.checkIfUserIsOwner = (cafe, creator) => {
    if (!cafe.creator.equals(creator._id)) {
        return false;
    }
    return true;
};

exports.checkUserRolesAndPermissions = (role) => {
    switch (role) {
        // Admin
        case 1:
            return true;
        // Cafe owner
        case 2:
            return true;
        // Regular user
        case 3:
            return false;
        default:
            break;
    }
};