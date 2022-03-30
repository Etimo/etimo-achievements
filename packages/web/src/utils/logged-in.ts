export default function loggedIn() {
  const status = localStorage.getItem('loggedIn') === 'true';
  console.log(status);
  return status;
}
