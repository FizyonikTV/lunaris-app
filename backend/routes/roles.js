const router = require('express').Router();
const auth = require('../middleware/auth');
const Server = require('../models/Server');

// Rol ekleme
router.post('/:serverId/roles', auth, async (req, res) => {
  try {
    const { roleName, permissions } = req.body;
    const server = await Server.findById(req.params.serverId);

    if (!server) {
      return res.status(404).json({ message: 'Sunucu bulunamadı' });
    }

    const newRole = {
      name: roleName,
      permissions,
    };

    server.roles.push(newRole);
    await server.save();

    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rol düzenleme
router.put('/:serverId/roles/:roleId', auth, async (req, res) => {
  try {
    const { roleName, permissions } = req.body;
    const server = await Server.findById(req.params.serverId);

    if (!server) {
      return res.status(404).json({ message: 'Sunucu bulunamadı' });
    }

    const role = server.roles.id(req.params.roleId);
    if (!role) {
      return res.status(404).json({ message: 'Rol bulunamadı' });
    }

    role.name = roleName || role.name;
    role.permissions = permissions || role.permissions;

    await server.save();

    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rol silme
router.delete('/:serverId/roles/:roleId', auth, async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId);

    if (!server) {
      return res.status(404).json({ message: 'Sunucu bulunamadı' });
    }

    server.roles = server.roles.filter((role) => role._id.toString() !== req.params.roleId);
    await server.save();

    res.json({ message: 'Rol silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;