
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, SafeAreaView, Button, Modal, TextInput } from "react-native";
import styles from "./styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const URL_API = "https://652670ee917d673fd76c44fe.mockapi.io/api/SinhVien";

const StudentListScreen = ({ route }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [newStudent, setNewStudent] = useState({ MaSV: "", TenSV: "", AnhDaiDien: "", DiemTB: "" });
  const openModal = () => { setModalVisible(true); };
  const closeModal = () => { setModalVisible(false); };
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const openDeleteConfirmation = () => { setDeleteConfirmationVisible(true); };
  const closeDeleteConfirmation = () => { setDeleteConfirmationVisible(false); };
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState({ MaSV: "", TenSV: "", AnhDaiDien: "", DiemTB: "" });
  const openEditModal = (student) => { setEditingStudent(student); setEditModalVisible(true); };
  const closeEditModal = () => { setEditModalVisible(false); };
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const searchStudent = () => {
    setIsSearching(true); // Đang tìm kiếm
    const results = data.filter((item) => item.TenSV.toLowerCase().includes(searchText.toLowerCase()));
    setSearchResults(results);
  };
  const sortStudents = () => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.DiemTB - b.DiemTB;
      } else {
        return b.DiemTB - a.DiemTB;
      }
    });
  
    setData(sortedData);
  };
  
  
  const editStudent = () => {
    if (editingStudent.MaSV === "" || editingStudent.TenSV === "" || editingStudent.AnhDaiDien === "" || editingStudent.DiemTB === "") {
      // Hiển thị thông báo rằng không được để trống
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    // Kiểm tra nếu "Điểm trung bình" là số và không lớn hơn 10
    const diemTB = parseFloat(editingStudent.DiemTB);
    if (isNaN(diemTB) || diemTB < 0.0 || diemTB > 10.0) {
      alert("Điểm trung bình phải là một số từ 0.0 đến 10.0");
      return;
    }
  
    // Thực hiện logic sửa thông tin sinh viên nếu thông tin hợp lệ
    fetch(`${URL_API}/${editingStudent.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingStudent),
    })
      .then(() => {
        getSinhVien(); // Cập nhật danh sách sau khi sửa
        closeEditModal(); // Đóng dialog sửa
      });
  };
  

  const getSinhVien = async () => {
    try {
      const response = await fetch(URL_API);
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = () => {
    if (newStudent.MaSV === "" || newStudent.TenSV === "" || newStudent.AnhDaiDien === "" || newStudent.DiemTB === "") {
      // Hiển thị thông báo rằng không được để trống
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    // Kiểm tra nếu "Điểm trung bình" là số và không lớn hơn 10
    const diemTB = parseFloat(newStudent.DiemTB);
    if (isNaN(diemTB) || diemTB < 0 || diemTB > 10) {
      alert("Điểm trung bình phải là một số từ 0 đến 10.");
      return;
    }
  
    // Thực hiện thêm sinh viên nếu thông tin hợp lệ
    fetch(URL_API, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    })
      .then((response) => {
        console.log(response.json());
        getSinhVien();
        closeModal();
      });
  };
  

  // Hàm xóa sinh viên
  const deleteStudent = (studentId) => {
    // Thực hiện logic xóa sinh viên
    fetch(`${URL_API}/${studentId}`, {
      method: "DELETE",
    })
      .then(() => {
        getSinhVien(); // Cập nhật danh sách sau khi xóa
      });
  };

  useEffect(() => {
    getSinhVien();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View>
            <View style={styles.tong}>
            <TouchableOpacity
              onPress={openModal} 
            >
              <Ionicons name="add" size={35} color="red" />
            </TouchableOpacity>
            <Button marginRight={10} title="Giảm" onPress={() => { setSortOrder("asc"); sortStudents(); }} />

            <Button magin={10} title="Tăng" onPress={() => { setSortOrder("desc"); sortStudents(); }} />

            </View>
              
              <TouchableOpacity onPress={searchStudent}>
              <View style={styles.tong}>
                <TextInput
                  placeholder="Nhập tên sinh viên"
                  value={searchText}
                  width="90%"
                  onChangeText={(text) => setSearchText(text)}
                />
                 <Ionicons name="search" size={24} color="red" />
                
              </View>
              </TouchableOpacity>
            


            <FlatList
            data={isSearching ? searchResults : data}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("StudentDetail", { student: item })}
                >
                  <View style={styles.itemContainer}>
                    <Image style={styles.image} source={{ uri: item.AnhDaiDien }} />
                    <View style={styles.textContainer}>
                      <Text style={styles.idText}>{item.MaSV}</Text>
                      <Text style={styles.titleText}>{item.TenSV}</Text>
                      <Text style={styles.titleText}>{item.DiemTB}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => openEditModal(item)}>
                      <Ionicons name="color-wand-outline" size={20} color="black" style={{ marginRight: 15 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => openDeleteConfirmation(item.id)} // mở dialog xóa
                    >
                      <Ionicons name="close-circle" size={24} color="red" />
                    </TouchableOpacity>
                   
                    <Modal visible={deleteConfirmationVisible} animationType="slide" transparent>
                      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: 300 }}>
                          <Text>Bạn có muốn xóa sinh viên này?</Text>
                          <Button title="Xóa" onPress={() => { deleteStudent(item.id); closeDeleteConfirmation(); }} />
                          {/* Thêm item.id vào hàm deleteStudent */}
                          <Button title="Hủy" onPress={closeDeleteConfirmation} />
                        </View>
                      </View>
                    </Modal>
                  </View>
                </TouchableOpacity>
              )}
            />
            <Modal visible={isModalVisible} animationType="slide" transparent>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: 300 }}>
                  <Text>Nhập thông tin sinh viên:</Text>
                  <TextInput
                    placeholder="Mã sinh viên"
                    value={newStudent.MaSV}
                    onChangeText={(text) => setNewStudent({ ...newStudent, MaSV: text })}
                  />
                  <TextInput
                    placeholder="Tên sinh viên"
                    value={newStudent.TenSV}
                    onChangeText={(text) => setNewStudent({ ...newStudent, TenSV: text })}
                  />
                  <TextInput
                    placeholder="Ảnh đại diện"
                    value={newStudent.AnhDaiDien}
                    onChangeText={(text) => setNewStudent({ ...newStudent, AnhDaiDien: text })}
                  />
                  <TextInput
                    placeholder="Điểm trung bình"
                    value={newStudent.DiemTB}
                    onChangeText={(number) => setNewStudent({ ...newStudent, DiemTB: number })}
                  />
                  <Button title="Thêm" onPress={addStudent} />
                  <Button title="Hủy" onPress={closeModal} />
                </View>
              </View>
            </Modal>
            <Modal visible={editModalVisible} animationType="slide" transparent>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: 300 }}>
                  <Text>Sửa thông tin sinh viên:</Text>
                  <TextInput
                    placeholder="Mã sinh viên"
                    value={editingStudent.MaSV}
                    onChangeText={(text) => setEditingStudent({ ...editingStudent, MaSV: text })}
                  />
                  <TextInput
                    placeholder="Tên sinh viên"
                    value={editingStudent.TenSV}
                    onChangeText={(text) => setEditingStudent({ ...editingStudent, TenSV: text })}
                  />
                  <TextInput
                    placeholder="Ảnh đại diện"
                    value={editingStudent.AnhDaiDien}
                    onChangeText={(text) => setEditingStudent({ ...editingStudent, AnhDaiDien: text })}
                  />
                  <TextInput
                    placeholder="Điểm trung bình"
                    value={editingStudent.DiemTB}
                    onChangeText={(number) => setEditingStudent({ ...editingStudent, DiemTB: number })}
                  />
                  <Button title="Sửa" onPress={editStudent} />
                  <Button title="Hủy" onPress={closeEditModal} />
                </View>
              </View>
            </Modal>

          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default StudentListScreen;
