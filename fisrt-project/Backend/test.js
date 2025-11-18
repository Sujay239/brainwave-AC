


 async function encodePasseord(password) {
    const round = 12;
    const salt = await bcrypt.genSalt(round);
    const hashPass = await bcrypt.hash(password,salt);

    return hashPass;
}