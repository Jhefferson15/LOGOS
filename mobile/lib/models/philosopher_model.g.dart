// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'philosopher_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Philosopher _$PhilosopherFromJson(Map<String, dynamic> json) => Philosopher(
  id: (json['id'] as num).toInt(),
  date: (json['date'] as num).toInt(),
  name: json['name'] as String,
  school: json['school'] as String,
  era: json['era'] as String,
  predecessors: (json['predecessors'] as List<dynamic>)
      .map((e) => (e as num).toInt())
      .toList(),
  keyConcepts: (json['keyConcepts'] as List<dynamic>)
      .map((e) => (e as num).toInt())
      .toList(),
  description: json['description'] as String,
  image: json['image'] as String,
  reputation: (json['reputation'] as num?)?.toInt(),
);

Map<String, dynamic> _$PhilosopherToJson(Philosopher instance) =>
    <String, dynamic>{
      'id': instance.id,
      'date': instance.date,
      'name': instance.name,
      'school': instance.school,
      'era': instance.era,
      'predecessors': instance.predecessors,
      'keyConcepts': instance.keyConcepts,
      'description': instance.description,
      'image': instance.image,
      'reputation': instance.reputation,
    };
