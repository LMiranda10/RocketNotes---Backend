const knex = require("../Database/knex");
const Apperror = require("../utils/Apperror");
const DiskStorage  = require("../providers/Diskstorage");



class UserAvatarController {
    async update(request, response) {
        const user_id = request.user.id;
        const avatarFilename = request.file.filename;

        const diskStorage = new DiskStorage();

        const user = await knex("users").where({ id: user_id }).first();

        if(!user) {
            throw new Apperror("Somente usuários autenticados podem alterar o avatar", 401)
        }

        if(user.avatar) {
            await diskStorage.deleteFile(user.avatar);
        }

        const filename = await diskStorage.saveFile(avatarFilename);
        user.avatar = filename;

        await knex("users").update(user).where({ id: user_id });

        return response.json(user)
    }
}

module.exports = UserAvatarController;