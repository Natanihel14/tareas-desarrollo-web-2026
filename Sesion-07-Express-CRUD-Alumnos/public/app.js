const API = '/alumnos';
const API_KEY = 'umg-2026';

const cabeceras = (conJson = true) => ({
    ...(conJson ? { 'Content-Type': 'application/json' } : {}),
    'x-api-key': API_KEY,
});

const tabla = document.querySelector('#tablaAlumnos tbody');
const mensaje = document.querySelector('#mensaje');
const dialogoForm = document.querySelector('#dialogoForm');
const dialogoEliminar = document.querySelector('#dialogoEliminar');
const form = document.querySelector('#formAlumno');
const tituloForm = document.querySelector('#tituloForm');
const nombreEliminar = document.querySelector('#nombreEliminar');

let idEnEdicion = null;
let idAEliminar = null;

async function cargarAlumnos() {
    try {
        const res = await fetch(API);
        const alumnos = await res.json();
        tabla.innerHTML = '';
        alumnos.forEach((al) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${al.id}</td>
                <td>${al.nombre}</td>
                <td>${al.apellido}</td>
                <td>${al.email}</td>
                <td>${al.edad !== undefined ? al.edad : ''}</td>
                <td>
                    <button class="btn-editar" data-id="${al.id}">Editar</button>
                    <button class="btn-eliminar" data-id="${al.id}" data-nombre="${al.nombre}">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });

        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', () => abrirDialogoEditar(btn.dataset.id));
        });
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => {
                nombreEliminar.textContent = btn.dataset.nombre;
                eliminarAlumno(btn.dataset.id);
            });
        });
    } catch (e) {
        mostrarMensaje('Error al cargar alumnos', 'error');
    }
}

function abrirDialogoNuevo() {
    form.reset();
    idEnEdicion = null;
    tituloForm.textContent = 'Nuevo alumno';
    dialogoForm.showModal();
    // For jsdom bug where showModal doesnt set open attribute
    dialogoForm.setAttribute('open', '');
}

async function abrirDialogoEditar(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error('No encontrado');
        const alumno = await res.json();
        document.querySelector('#nombre').value = alumno.nombre;
        document.querySelector('#apellido').value = alumno.apellido;
        document.querySelector('#email').value = alumno.email;
        document.querySelector('#edad').value = alumno.edad !== undefined ? alumno.edad : '';
        idEnEdicion = id;
        tituloForm.textContent = 'Editar alumno';
        dialogoForm.showModal();
        dialogoForm.setAttribute('open', '');
    } catch (e) {
        mostrarMensaje('Error al cargar alumno', 'error');
    }
}

async function guardarAlumno(event) {
    event.preventDefault();
    const data = {
        nombre: document.querySelector('#nombre').value,
        apellido: document.querySelector('#apellido').value,
        email: document.querySelector('#email').value,
    };
    if (document.querySelector('#edad').value !== '') {
        data.edad = Number(document.querySelector('#edad').value);
    }

    try {
        const url = idEnEdicion ? `${API}/${idEnEdicion}` : API;
        const method = idEnEdicion ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: cabeceras(true),
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Error al guardar');
        }

        dialogoForm.close();
        dialogoForm.removeAttribute('open');
        mostrarMensaje(idEnEdicion ? 'Alumno actualizado' : 'Alumno creado');
        await cargarAlumnos();
    } catch (e) {
        mostrarMensaje(e.message, 'error');
    }
}

function eliminarAlumno(id) {
    idAEliminar = id;
    dialogoEliminar.showModal();
    dialogoEliminar.setAttribute('open', '');
}

function mostrarMensaje(texto, tipo = 'ok') {
    mensaje.textContent = texto;
    mensaje.className = tipo;
    setTimeout(() => {
        mensaje.textContent = '';
        mensaje.className = '';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#btnNuevo').addEventListener('click', abrirDialogoNuevo);
    form.addEventListener('submit', guardarAlumno);
    document.querySelector('#btnCancelar').addEventListener('click', () => {
        dialogoForm.close();
        dialogoForm.removeAttribute('open');
    });
    document.querySelector('#btnCancelarEliminar').addEventListener('click', () => {
        dialogoEliminar.close();
        dialogoEliminar.removeAttribute('open');
    });
    document.querySelector('#btnConfirmarEliminar').addEventListener('click', async () => {
        if (!idAEliminar) return;
        try {
            const res = await fetch(`${API}/${idAEliminar}`, {
                method: 'DELETE',
                headers: cabeceras(false),
            });
            if (!res.ok) throw new Error('Error al eliminar');
            dialogoEliminar.close();
            dialogoEliminar.removeAttribute('open');
            mostrarMensaje('Alumno eliminado');
            await cargarAlumnos();
        } catch (e) {
            mostrarMensaje(e.message, 'error');
        }
    });

    cargarAlumnos();
});
