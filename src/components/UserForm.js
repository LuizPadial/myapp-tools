import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";

function UserForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        name: "",
        registration: "",
        biometricData: "",
        manager: false,
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Envia os dados para o componente pai
    };

    return (
        <Container className="mt-4">
            <Card className="p-4 shadow-sm">
                <Card.Title className="text-center">Cadastro de Usuário</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="name">
                                <Form.Label>Usuário</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nome do usuário"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="registration">
                                <Form.Label>Matrícula</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Matrícula"
                                    name="registration"
                                    value={formData.registration}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="biometricData">
                                <Form.Label>Biometria</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Dados biométricos"
                                    name="biometricData"
                                    value={formData.biometricData}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="manager">
                                <Form.Label>Admin</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="É administrador"
                                    name="manager"
                                    checked={formData.manager}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="username">
                                <Form.Label>Login</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nome de login"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="password">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Senha"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="text-center mt-3">
                        <Button variant="primary" type="submit">Cadastrar</Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
}

export default UserForm;
