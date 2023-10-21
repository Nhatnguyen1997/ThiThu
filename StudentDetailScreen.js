import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./styles";
const StudentDetailScreen = ({ route }) => {
  const { student } = route.params;

  return (
    <View style={styles.chitiet}>
      <Image style={styles.imagechitiet} source={{ uri: student.AnhDaiDien }} />
      <View style={styles.xep}>
      <Text>Tên Sinh Viên : </Text>
      <Text>{student.TenSV}</Text>
      </View>
      <View style={styles.xep}>
      <Text>Mã Sinh Viên : </Text>
      <Text>{student.MaSV}</Text>
      </View>
      <View style={styles.xep}> 
      <Text>Điểm Trung Bình : </Text>
      <Text>{student.DiemTB}</Text>
      </View>
      
      {/* Thêm các thông tin khác tại đây */}
    </View>
  );
};

export default StudentDetailScreen;
