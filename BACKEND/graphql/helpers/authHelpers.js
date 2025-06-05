function requireAuth(context) {
  if (!context.user) throw new Error("No autenticado");
}

function requireOwner(context, resourceOwnerId) {
  if (context.user.id_usuario !== resourceOwnerId) {
    throw new Error("Acceso no autorizado");
  }
}

module.exports = { requireAuth, requireOwner };