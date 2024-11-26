export const emptyFirstname = 'Not';
export const emptyLastname = 'Available';

export const extractNames = (
  fullname?: string,
): { firstname: string; lastname: string } => {
  const notAvailable = { firstname: emptyFirstname, lastname: emptyLastname };

  if (!fullname) {
    return notAvailable;
  }
  const nameParts = fullname.split(' ');
  if (nameParts.length < 2) {
    return notAvailable;
  }

  const firstname = nameParts[0];
  const lastname = nameParts[nameParts.length - 1];

  return { firstname, lastname: lastname ? lastname : '' };
};
