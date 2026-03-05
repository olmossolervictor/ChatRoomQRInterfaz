import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { StorageHelper, User } from '../../../utils/storage';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    username: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
    fechaNacimiento: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(formData.fechaNacimiento.getMonth());
  const [currentYear, setCurrentYear] = useState(formData.fechaNacimiento.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(formData.fechaNacimiento.getMonth());
  const [calendarYear, setCalendarYear] = useState(formData.fechaNacimiento.getFullYear());

  // Calcular la fecha máxima permitida (hace 18 años desde hoy)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  // Nombres de meses en español
  const mesesEnEspanol = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Generar años disponibles (desde 1930 hasta hace 18 años)
  const yearsAvailable = [];
  for (let year = 1930; year <= maxDate.getFullYear(); year++) {
    yearsAvailable.push(year.toString());
  }

  // Efecto para sincronizar el calendario en tiempo real
  useEffect(() => {
    // Forzar actualización del calendario cuando cambian los selectores
    if (showDatePicker) {
      // Pequeño delay para asegurar que el modal está completamente renderizado
      const timer = setTimeout(() => {
        // Esto fuerza al calendario a re-renderizarse con los nuevos valores
        setCalendarMonth(currentMonth);
        setCalendarYear(currentYear);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentMonth, currentYear, showDatePicker]);

  const handleRegister = async () => {
    // Validación básica
    if (!formData.nombre.trim() || !formData.apellidos.trim() || 
        !formData.username.trim() || !formData.correo.trim() || 
        !formData.contraseña.trim() || !formData.confirmarContraseña.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Validar edad (mayor de 18 años)
    const fechaNac = new Date(formData.fechaNacimiento);
    
    if (fechaNac > maxDate) {
      Alert.alert('Error', 'Debes ser mayor de 18 años para registrarte');
      return;
    }

    setIsLoading(true);
    
    try {
      // Convertir fecha a string
      const fechaNacimientoString = fechaNac.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      // Guardar usuario usando StorageHelper
      const newUser = await StorageHelper.saveUser({
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        username: formData.username.trim(),
        correo: formData.correo.trim(),
        contraseña: formData.contraseña,
        fechaNacimiento: fechaNacimientoString,
        descripcion: '',
        avatar: 'default'
      });

      // Guardar como usuario actual (sesión)
      await StorageHelper.setCurrentUser(newUser);

      setIsLoading(false);
      Alert.alert(
        '✅ Registro Exitoso', 
        'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login' as any)
          }
        ]
      );
      
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error de Registro', error.message || 'No se pudo completar el registro');
    }
  };
  
  // const goToMenu = () => {
  //   router.replace('/(tabs)/index');
  // };

  const goToLogin = () => {
    router.replace('/auth/login');
  };

  const updateFormData = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (day: any) => {
    const selectedDate = new Date(day.dateString);
    
    if (selectedDate <= maxDate) {
      updateFormData('fechaNacimiento', selectedDate);
      setCurrentMonth(selectedDate.getMonth());
      setCurrentYear(selectedDate.getFullYear());
      setCalendarMonth(selectedDate.getMonth());
      setCalendarYear(selectedDate.getFullYear());
      setShowDatePicker(false);
    } else {
      Alert.alert('Error', 'Debes ser mayor de 18 años para registrarte');
    }
  };

  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setCalendarMonth(monthIndex);
    setShowMonthPicker(false);
    
    // Actualizar la fecha seleccionada con el nuevo mes
    const newDate = new Date(currentYear, monthIndex, formData.fechaNacimiento.getDate());
    if (newDate <= maxDate) {
      updateFormData('fechaNacimiento', newDate);
    } else {
      // Si la nueva fecha excede el límite, ajustar al último día válido
      const lastValidDate = new Date(maxDate);
      lastValidDate.setMonth(monthIndex);
      if (lastValidDate > maxDate) {
        setCurrentMonth(maxDate.getMonth());
        setCalendarMonth(maxDate.getMonth());
        showAlert({
          title: 'Error',
          message: 'Debes ser mayor de 18 años para registrarte',
          type: 'error'
        });
      } else {
        updateFormData('fechaNacimiento', lastValidDate);
      }
    }
  };

  const handleYearChange = (year: string) => {
    const yearNum = parseInt(year);
    setCurrentYear(yearNum);
    setCalendarYear(yearNum);
    setShowYearPicker(false);
    
    // Actualizar la fecha seleccionada con el nuevo año
    const newDate = new Date(yearNum, currentMonth, formData.fechaNacimiento.getDate());
    if (newDate <= maxDate) {
      updateFormData('fechaNacimiento', newDate);
    } else {
      // Si el año excede el límite, ajustar al año máximo
      setCurrentYear(maxDate.getFullYear());
      setCalendarYear(maxDate.getFullYear());
      Alert.alert('Error', 'Debes ser mayor de 18 años para registrarte');
    }
  };

  const getMarkedDates = () => {
    const dateString = formData.fechaNacimiento.toISOString().split('T')[0];
    return {
      [dateString]: {
        selected: true,
        selectedColor: '#007AFF',
        selectedTextColor: 'white'
      }
    };
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Regístrate en ChatRoomQR</Text>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nombre}
                  onChangeText={(value) => updateFormData('nombre', value)}
                  placeholder="Nombre"
                  autoCapitalize="words"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Apellidos</Text>
                <TextInput
                  style={styles.input}
                  value={formData.apellidos}
                  onChangeText={(value) => updateFormData('apellidos', value)}
                  placeholder="Apellidos"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Usuario</Text>
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={(value) => updateFormData('username', value)}
                placeholder="Elige un usuario"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                value={formData.correo}
                onChangeText={(value) => updateFormData('correo', value)}
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha de nacimiento</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formData.fechaNacimiento.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            <Modal
              visible={showDatePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Selecciona tu fecha de nacimiento</Text>
                    <TouchableOpacity 
                      style={styles.closeButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.customHeader}>
                    <View style={styles.selectorsContainer}>
                      <TouchableOpacity 
                        style={styles.selectorButton}
                        onPress={() => setShowMonthPicker(true)}
                      >
                        <Text style={styles.selectorText}>
                          {mesesEnEspanol[currentMonth]}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.selectorButton}
                        onPress={() => setShowYearPicker(true)}
                      >
                        <Text style={styles.selectorText}>
                          {currentYear}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Modal para selector de mes */}
                  <Modal
                    visible={showMonthPicker}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowMonthPicker(false)}
                  >
                    <View style={styles.pickerModalOverlay}>
                      <View style={styles.pickerModalContent}>
                        <View style={styles.pickerHeader}>
                          <Text style={styles.pickerTitle}>Seleccionar Mes</Text>
                          <TouchableOpacity 
                            style={styles.pickerCloseButton}
                            onPress={() => setShowMonthPicker(false)}
                          >
                            <Text style={styles.pickerCloseButtonText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                        
                        <Picker
                          selectedValue={currentMonth}
                          onValueChange={handleMonthChange}
                          style={styles.picker}
                          itemStyle={styles.pickerItem}
                        >
                          {mesesEnEspanol.map((mes, index) => (
                            <Picker.Item key={index} label={mes} value={index} />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  </Modal>

                  {/* Modal para selector de año */}
                  <Modal
                    visible={showYearPicker}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowYearPicker(false)}
                  >
                    <View style={styles.pickerModalOverlay}>
                      <View style={styles.pickerModalContent}>
                        <View style={styles.pickerHeader}>
                          <Text style={styles.pickerTitle}>Seleccionar Año</Text>
                          <TouchableOpacity 
                            style={styles.pickerCloseButton}
                            onPress={() => setShowYearPicker(false)}
                          >
                            <Text style={styles.pickerCloseButtonText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                        
                        <Picker
                          selectedValue={currentYear.toString()}
                          onValueChange={(year) => handleYearChange(year)}
                          style={styles.picker}
                          itemStyle={styles.pickerItem}
                        >
                          {yearsAvailable.map((year) => (
                            <Picker.Item key={year} label={year} value={year} />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  </Modal>

                  <Calendar
                    key={`${calendarYear}-${calendarMonth}`}
                    onDayPress={handleDateChange}
                    markedDates={getMarkedDates()}
                    maxDate={maxDate.toISOString().split('T')[0]}
                    enableSwipeMonths={true}
                    showWeekNumbers={false}
                    firstDay={1}
                    monthFormat={'MMMM yyyy'}
                    current={`${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-01`}
                    onMonthChange={(month) => {
                      setCalendarMonth(month.month - 1);
                      setCalendarYear(month.year);
                    }}
                    theme={{
                      backgroundColor: '#ffffff',
                      calendarBackground: '#ffffff',
                      textSectionTitleColor: '#b6c1cd',
                      selectedDayBackgroundColor: '#007AFF',
                      selectedDayTextColor: '#ffffff',
                      todayTextColor: '#007AFF',
                      dayTextColor: '#2d4150',
                      textDisabledColor: '#d9e1e8',
                      arrowColor: '#007AFF',
                      monthTextColor: '#2d4150',
                      textDayFontFamily: 'WorkSans-Medium',
                      textMonthFontFamily: 'WorkSans-Black',
                      textDayHeaderFontFamily: 'WorkSans-Medium',
                      textDayFontSize: 16,
                      textMonthFontSize: 16,
                      textDayHeaderFontSize: 13
                    }}
                  />
                </View>
              </View>
            </Modal>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                value={formData.contraseña}
                onChangeText={(value) => updateFormData('contraseña', value)}
                placeholder="Crea una contraseña"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput
                style={styles.input}
                value={formData.confirmarContraseña}
                onChangeText={(value) => updateFormData('confirmarContraseña', value)}
                placeholder="Repite tu contraseña"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.link}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
    fontFamily: 'WorkSans-Black',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    fontFamily: 'WorkSans-Light',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
    fontFamily: 'WorkSans-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    fontFamily: 'WorkSans-Medium',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'WorkSans-Medium',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'WorkSans-Medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    fontFamily: 'WorkSans-Medium',
  },
  link: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: 'WorkSans-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'WorkSans-Medium',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  modalNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'WorkSans-Light',
  },
  customHeader: {
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
  },
  selectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  selectorButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: 'WorkSans-Medium',
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  pickerModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f8f8',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'WorkSans-Medium',
  },
  pickerCloseButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  pickerCloseButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'WorkSans-Medium',
  },
  picker: {
    width: '100%',
    height: 200,
  },
  pickerItem: {
    fontSize: 18,
    fontFamily: 'WorkSans-Medium',
    color: '#333',
  },
});
