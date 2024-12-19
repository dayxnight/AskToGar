const socket = io();

document.getElementById('questionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const question = document.getElementById('questionInput').value;
    if (question.trim()) {
        socket.emit('newQuestion', question);
        document.getElementById('questionInput').value = '';
        popup('pesanmu telah terkirim')
    } else {
        popup("error", "masukkan pesan yang benar")
    }
});
function popup(message){
    
}