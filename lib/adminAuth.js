export function checkAuth(req) {
  const passcode = req.headers.get('x-admin-passcode');
  return Boolean(passcode) && passcode === process.env.ADMIN_PASSCODE;
}