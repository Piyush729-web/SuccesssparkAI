export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


export const getInitials = (title) =>{
    if(!title) return "";
    const words = title.split(" ").filter(word => word.length > 0);;
    let initials = "";

    for(let i=0;i<Math.min(words.length,2);i++)
    {
        if (words[i] && words[i][0]) {
            initials += words[i][0];
        }
    }
    return initials.toUpperCase();
};