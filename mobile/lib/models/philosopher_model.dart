import 'package:json_annotation/json_annotation.dart';

part 'philosopher_model.g.dart';

@JsonSerializable()
class Philosopher {
  final int id;
  final int date;
  final String name;
  final String school;
  final String era;
  final List<int> predecessors;
  final List<int> keyConcepts;
  final String description;
  final String image;
  final int? reputation;

  // Position for the library tree (optional/visual)
  @JsonKey(ignore: true)
  final Map<String, String>? pos;

  Philosopher({
    required this.id,
    required this.date,
    required this.name,
    required this.school,
    required this.era,
    required this.predecessors,
    required this.keyConcepts,
    required this.description,
    required this.image,
    this.reputation,
    this.pos,
  });

  factory Philosopher.fromJson(Map<String, dynamic> json) => _$PhilosopherFromJson(json);
  Map<String, dynamic> toJson() => _$PhilosopherToJson(this);
}
